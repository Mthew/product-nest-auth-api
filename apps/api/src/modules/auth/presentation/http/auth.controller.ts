import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse, ApiOperation } from '@nestjs/swagger';

import { LocalAuthGuard } from '../../application/guards/local-auth.guard';
import { LoginDto } from '../../application/dtos/login.dto';
import { Public } from '../../domain/decorators/public.decorator';
import { AuthService } from '../../application/services/auth.services';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in user and return JWT' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful, JWT returned.',
    schema: { example: { access_token: 'jwt.token.string' } },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized (Invalid Credentials).',
  })
  async login(@Request() req, @Body() loginDto: LoginDto) {
    return this.authService.login(req.user);
  }
}
