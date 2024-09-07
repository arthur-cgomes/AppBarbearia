import { Controller, Post, Body, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiTags,
  ApiOperation,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { AuthPayload } from './interfaces/auth.interface';
import { UserService } from '../user/user.service';
import { ResetPasswordDto } from '../user/dto/reset-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

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

  @ApiOperation({
    summary: 'Recuperação de senha do usuário',
    description:
      'Permite que o usuário recupere sua senha usando a data de nascimento e o documento.',
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado',
  })
  @Patch('/reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const { birthdate, document, newPassword } = resetPasswordDto;
    await this.userService.resetPassword(birthdate, document, newPassword);
    return { message: 'Senha alterada com sucesso!' };
  }
}
