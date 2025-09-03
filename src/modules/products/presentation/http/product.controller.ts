import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  NotFoundException as NestNotFoundException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

import { CreateProductDto } from '../../application/dtos/create-product.dto';
import { UpdateProductDto } from '../../application/dtos/update-product.dto';
import { ProductDto } from '../../application/dtos/product.dto';

// --- Import Commands and Queries ---
import { CreateProductCommand } from '../../application/commands/create-product/command';
import { UpdateProductCommand } from '../../application/commands/update-product/command';
import { DeleteProductCommand } from '../../application/commands/delete-product/command';
import { FindAllProductsQuery } from '../../application/queries/find-all/query';
import { FindProductByIdQuery } from '../../application/queries/find-by-id/query';

import { ProductNotFoundException } from '../../domain/exceptions/product-not-found.exception';
import { JwtAuthGuard } from 'src/modules/auth/application/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/application/guards/roles.guard';
import { Roles } from 'src/modules/auth/domain/decorators/roles.decorator';
import { Role } from 'src/modules/user/domain/entities/role.enum';

@ApiTags('products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Roles(Role.Admin) // Only admins can create products
  @ApiOperation({ summary: 'Create a new product [Admin Only]' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully.',
    type: ProductDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - bad/missing token.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - wrong role.' })
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductDto> {
    return this.commandBus.execute(new CreateProductCommand(createProductDto));
  }

  @Get()
  @Roles(Role.Admin, Role.Seller) // Both roles can view products
  @ApiOperation({ summary: 'Retrieve all products or filter by category' })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filter products by category',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'List of products.',
    type: [ProductDto],
  })
  async findAll(@Query('category') category?: string): Promise<ProductDto[]> {
    return this.queryBus.execute(new FindAllProductsQuery(category));
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Seller) // Both roles can view individual products
  @ApiOperation({ summary: 'Retrieve a specific product by ID' })
  @ApiParam({ name: 'id', description: 'Product ObjectId', type: String })
  @ApiResponse({
    status: 200,
    description: 'Product details.',
    type: ProductDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async findOne(@Param('id') id: string): Promise<ProductDto> {
    try {
      return await this.queryBus.execute(new FindProductByIdQuery(id));
    } catch (error) {
      if (error instanceof ProductNotFoundException) {
        throw new NestNotFoundException(error.message);
      }
      throw error;
    }
  }

  @Patch(':id')
  @Roles(Role.Admin) // Only admins can update products
  @ApiOperation({ summary: "Update a product's information [Admin Only]" })
  @ApiParam({ name: 'id', description: 'Product ObjectId', type: String })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully.',
    type: ProductDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductDto> {
    try {
      return await this.commandBus.execute(
        new UpdateProductCommand(id, updateProductDto),
      );
    } catch (error) {
      if (error instanceof ProductNotFoundException) {
        throw new NestNotFoundException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id')
  @Roles(Role.Admin) // Only admins can delete products
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a product [Admin Only]' })
  @ApiParam({ name: 'id', description: 'Product ObjectId', type: String })
  @ApiResponse({ status: 204, description: 'Product deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async remove(@Param('id') id: string): Promise<void> {
    try {
      const deleted = await this.commandBus.execute(
        new DeleteProductCommand(id),
      );
      if (!deleted) {
        throw new NestNotFoundException(`Product with ID "${id}" not found.`);
      }
    } catch (error) {
      if (error instanceof ProductNotFoundException) {
        throw new NestNotFoundException(error.message);
      }
      throw error;
    }
  }
}
