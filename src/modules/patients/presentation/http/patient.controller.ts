import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Inject,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  NotFoundException as NestNotFoundException,
  Request,
  ServiceUnavailableException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { CreatePatientDto } from '../../application/dtos/create-patient.dto';
import { UpdatePatientDto } from '../../application/dtos/update-patient.dto';
import { PatientDto } from '../../application/dtos/patient.dto';

// --- Import Commands and Queries ---
import { CreatePatientCommand } from '../../application/commands/create-patient/command';
import { UpdatePatientCommand } from '../../application/commands/update-patient/command';
import { DeletePatientCommand } from '../../application/commands/delete-patient/command';
import { FindAllPatientsQuery } from '../../application/queries/find-all/query';
import { FindPatientByIdQuery } from '../../application/queries/find-by-id/query';

import { PatientNotFoundException } from '../../domain/exceptions/patient-not-found.exception'; // Import custom domain exception
import { JwtAuthGuard } from 'src/modules/auth/application/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/application/guards/roles.guard';
import { Roles } from 'src/modules/auth/domain/decorators/roles.decorator';
import { Role } from 'src/modules/user/domain/entities/role.enum';
import { DiagnosisResponseDto } from '../../application/dtos/diagnostic-response.dto';
import { GenerateDiagnosisCommand } from '../../application/commands/generate-diagnosis/command';

@ApiTags('patients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('patients')
export class PatientController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Roles(Role.Doctor)
  @ApiOperation({ summary: 'Create a new patient record [Doctor Only]' })
  @ApiBody({ type: CreatePatientDto })
  @ApiResponse({
    status: 201,
    description: 'Patient created successfully.',
    type: PatientDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - bad/missing token.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - wrong role.' })
  async create(
    @Body() createPatientDto: CreatePatientDto,
  ): Promise<PatientDto> {
    return this.commandBus.execute(new CreatePatientCommand(createPatientDto));
  }

  @Get()
  @Roles(Role.Doctor)
  @ApiOperation({ summary: 'Retrieve all patient records [Doctor Only]' })
  @ApiResponse({
    status: 200,
    description: 'List of all patients.',
    type: [PatientDto],
  })
  async findAll(): Promise<PatientDto[]> {
    return this.queryBus.execute(new FindAllPatientsQuery());
  }

  @Get(':id')
  @Roles(Role.Doctor, Role.Patient)
  @ApiOperation({
    summary: 'Retrieve a specific patient by ID [Doctor & Patient can access]',
  })
  @ApiParam({ name: 'id', description: 'Patient UUID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Patient details.',
    type: PatientDto,
  })
  @ApiResponse({ status: 404, description: 'Patient not found.' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
  ): Promise<PatientDto> {
    try {
      return await this.queryBus.execute(new FindPatientByIdQuery(id));
    } catch (error) {
      if (error instanceof PatientNotFoundException) {
        throw new NestNotFoundException(error.message);
      }
      throw error;
    }
  }

  @Patch(':id')
  @Roles(Role.Doctor, Role.Patient)
  @ApiOperation({
    summary: "Update a patient's information [Doctor & Patient can access]",
  })
  @ApiParam({ name: 'id', description: 'Patient UUID', type: String })
  @ApiBody({ type: UpdatePatientDto })
  @ApiResponse({
    status: 200,
    description: 'Patient updated successfully.',
    type: PatientDto,
  })
  @ApiResponse({ status: 404, description: 'Patient not found.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ): Promise<PatientDto> {
    try {
      return await this.commandBus.execute(
        new UpdatePatientCommand(id, updatePatientDto),
      );
    } catch (error) {
      if (error instanceof PatientNotFoundException) {
        throw new NestNotFoundException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id')
  @Roles(Role.Doctor)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a patient record [Doctor only can access]' })
  @ApiParam({ name: 'id', description: 'Patient UUID', type: String })
  @ApiResponse({ status: 204, description: 'Patient deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Patient not found.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    try {
      const deleted = await this.commandBus.execute(
        new DeletePatientCommand(id),
      );
      if (!deleted) {
        throw new NestNotFoundException(`Patient with ID "${id}" not found.`);
      }
    } catch (error) {
      if (error instanceof PatientNotFoundException) {
        throw new NestNotFoundException(error.message);
      }
      throw error;
    }
  }

  @Post(':id/diagnosis-ai')
  @Roles(Role.Doctor)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      '[Doctor Only] Generate AI-suggested diagnosis based on medical history',
  })
  @ApiParam({ name: 'id', description: 'Patient UUID', type: String })
  @ApiResponse({
    status: 200,
    description: 'AI diagnosis suggestion generated successfully.',
    type: DiagnosisResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Patient not found.' })
  @ApiResponse({
    status: 503,
    description: 'AI service is unavailable or failed.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden (Insufficient Role).' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async generateDiagnosis(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
  ): Promise<DiagnosisResponseDto> {
    try {
      const result = await this.commandBus.execute(
        new GenerateDiagnosisCommand(id),
      );
      return result;
    } catch (error) {
      if (error instanceof PatientNotFoundException) {
        throw new NestNotFoundException(error.message);
      }
      if (error instanceof ServiceUnavailableException) {
        throw error;
      }
      console.error(
        `Controller Error generating AI diagnosis for patient ${id}:`,
        error,
      );
      throw error;
    }
  }
}
