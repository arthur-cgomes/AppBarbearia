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
import { UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteResponseDto } from 'src/common/dto/delete-response.dto';
import { CreateSchedulingDto } from './dto/create-scheduling.dto';
import { GetAllSchedulingResponseDto } from './dto/get-all-scheduling-response.dto';
import { SchedulingDto } from './dto/scheduling.dto';
import { UpdateSchedulingDto } from './dto/update-scheduling.dto';
import { SchedulingService } from './scheduling.service';

@ApiBearerAuth()
@ApiTags('Scheduling')
@Controller('scheduling')
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @UseGuards(AuthGuard())
  @Post()
  @ApiOperation({
    summary: 'Agenda um horário',
  })
  @ApiCreatedResponse({ type: SchedulingDto })
  @ApiConflictResponse({ description: 'Horário já agendado' })
  async createScheduling(@Body() createSchedulingDto: CreateSchedulingDto) {
    return await this.schedulingService.createScheduling(createSchedulingDto);
  }

  @UseGuards(AuthGuard())
  @Put('/:schedulingId')
  @ApiOperation({
    summary: 'Atualiza um horário',
  })
  @ApiOkResponse({ type: SchedulingDto })
  @ApiNotFoundResponse({
    description: 'Horário não encontrado',
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
  })
  async updateScheduling(
    @Param('schedulingId') schedulingId: string,
    @Body() updateSchedulingDto: UpdateSchedulingDto,
  ) {
    return await this.schedulingService.updateScheduling(
      schedulingId,
      updateSchedulingDto,
    );
  }

  @Get('/:schedulingId')
  @ApiOperation({
    summary: 'Busca um horário pelo id',
  })
  @ApiOkResponse({ type: SchedulingDto })
  @ApiNotFoundResponse({
    description: 'Horário não encontrado',
  })
  async getSchedulingById(@Param('schedulingId') schedulingId: string) {
    return await this.schedulingService.getSchedulingById(schedulingId);
  }

  @Get()
  @ApiOperation({
    summary: 'Retorna todos os horários',
  })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'sort', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'barberId', required: false })
  @ApiQuery({ name: 'barberShopId', required: false })
  @ApiOkResponse({ type: GetAllSchedulingResponseDto })
  async getAllUsers(
    @Query('take') take = 10,
    @Query('skip') skip = 0,
    @Query('sort') sort = 'date',
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',
    @Query('userId') userId?: string,
    @Query('barberId') barberId?: string,
    @Query('barberShopId') barberShopId?: string,
  ) {
    return await this.schedulingService.getAllSchedulings(
      take,
      skip,
      sort,
      order,
      userId,
      barberId,
      barberShopId,
    );
  }

  @UseGuards(AuthGuard())
  @Delete('/:schedulingId')
  @ApiOperation({
    summary: 'Exclui um horário',
  })
  @ApiOkResponse({ type: DeleteResponseDto })
  @ApiNotFoundResponse({ description: 'Horário não encontrado' })
  async deleteSchedulingById(@Param('schedulingId') schedulingId: string) {
    return {
      message: await this.schedulingService.deleteSchedulingById(schedulingId),
    };
  }
}
