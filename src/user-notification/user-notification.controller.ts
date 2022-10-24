import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GetAllUserNotificationsResponseDto } from './dto/get-all-user-notification.dto';
import { UserNotificationDto } from './dto/user-notification.dto';
import { UserNotificationService } from './user-notification.service';

@ApiBearerAuth()
@ApiTags('User-Notification')
@Controller('user-notifications')
export class UserNotificationController {
  constructor(
    private readonly userNotificationService: UserNotificationService,
  ) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Retorna uma notificação do usuário pelo id',
  })
  @ApiOkResponse({ type: UserNotificationDto })
  @ApiNotFoundResponse({
    description: 'Notificação não encontrada',
  })
  async getUserNotificationById(@Param('id') id: string) {
    return await this.userNotificationService.getUserNotificationById(id);
  }

  @Patch(':id/read')
  @ApiOperation({
    summary: 'Atualiza a notificação para lida',
  })
  @ApiOkResponse({ type: UserNotificationDto })
  @ApiNotFoundResponse({
    description: 'Notificação não encontrada',
  })
  async updateUserNotificationRead(@Param('id') id: string) {
    return await this.userNotificationService.updateUserNotificationRead(id);
  }

  @Get()
  @ApiOperation({
    summary: 'Retorna todas as notificações de um usuário',
  })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'read', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'title', required: false })
  @ApiOkResponse({ type: GetAllUserNotificationsResponseDto })
  async getAllUsersNotification(
    @Query('take') take = 10,
    @Query('skip') skip = 0,
    @Query('read') read: boolean,
    @Query('userId') userId?: string,
    @Query('title') title?: string,
  ) {
    return await this.userNotificationService.getAllUsersNotification(
      take,
      skip,
      read,
      userId,
      title,
    );
  }
}
