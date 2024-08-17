import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiTags,
  ApiOperation,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthPayload } from './interfaces/auth.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'Autentica o usuário',
    description: `Roles: ${process.env.ALL}`,
  })
  @ApiUnauthorizedResponse({
    description: 'Senha inválida',
  })
  @ApiForbiddenResponse({
    description: 'Token inválido',
  })
  @Post()
  async login(@Body() auth: AuthPayload) {
    return await this.authService.validateUserByPassword(auth);
  }
}
