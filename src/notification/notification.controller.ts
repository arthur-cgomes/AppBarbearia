import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteResponseDto } from '../common/dto/delete-response.dto';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { GetAllNotificationsResponseDto } from './dto/get-all-notification-response.dto';
import { NotificationDto } from './dto/notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationService } from './notification.service';

@ApiBearerAuth()
@ApiTags('Notification')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  @Post()
  @ApiOperation({
    summary: 'Cria uma notificação',
  })
  @ApiCreatedResponse({ type: NotificationDto })
  async createNotification(
    @Param('id') id: string,
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    return await this.notificationService.createNotification(
      id,
      createNotificationDto,
    );
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualiza uma notificação',
  })
  @ApiOkResponse({ type: NotificationDto })
  @ApiNotFoundResponse({ description: 'Notificação não encontrada' })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
  })
  async updateNotification(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return await this.notificationService.updateNotification(
      id,
      updateNotificationDto,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retorna uma notificação pelo id',
  })
  @ApiOkResponse({ type: NotificationDto })
  @ApiNotFoundResponse({ description: 'Notificação não encontrada' })
  async getNotificationById(
    @Param('id') id: string
  ) {
    return await this.notificationService.getNotificationById(id);
  }

  @Get()
  @ApiOperation({
    summary: 'Retorna todas as notificações',
  })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'title', required: false })
  @ApiOkResponse({ type: GetAllNotificationsResponseDto })
  async getAllUsers(
    @Query('take') take = 10,
    @Query('skip') skip = 0,
    @Query('userId') userId?: string,
    @Query('title') title?: string,
  ) {
    return await this.notificationService.getAllNotification(
      take,
      skip,
      userId,
      title,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Exclui uma notificação',
  })
  @ApiOkResponse({ type: DeleteResponseDto })
  @ApiNotFoundResponse({ description: 'Notificação não encontrada' })
  async deleteNotificationById(
    @Param('id') id: string
  ) {
    return { message: await this.notificationService.deleteNotification(id) };
  }
}
