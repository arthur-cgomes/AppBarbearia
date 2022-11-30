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
import { SchedulingService } from './scheduling.service';

@ApiBearerAuth()
@ApiTags('Scheduling')
@Controller('schedulings')
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @Post()
  @ApiOperation({
    summary: 'Agenda um horário',
  })
  @ApiCreatedResponse({ type: SchedulingDto })
  @ApiConflictResponse({ description: 'Horário já agendado' })
  async createScheduling(@Body() createSchedulingDto: CreateSchedulingDto) {
    return await this.schedulingService.createScheduling(createSchedulingDto);
  }

  @Put(':schedulingId')
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
    @Body() updateSchedulingDto: CreateSchedulingDto,
  ) {
    return await this.schedulingService.updateScheduling(
      schedulingId,
      updateSchedulingDto,
    );
  }

  @Get(':schedulingId')
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
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'schedulingId', required: false })
  @ApiOkResponse({ type: GetAllSchedulingResponseDto })
  async getAllUsers(
    @Query('take') take = 10,
    @Query('skip') skip = 0,
    @Query('userId') userId?: string,
    @Query('schedulingId') schedulingId?: string,
  ) {
    return await this.schedulingService.getAllScheduling(
      take,
      skip,
      userId,
      schedulingId,
    );
  }

  @Delete(':schedulingId')
  @ApiOperation({
    summary: 'Exclui um horário',
  })
  @ApiOkResponse({ type: DeleteResponseDto })
  @ApiNotFoundResponse({ description: 'Horário não encontrado' })
  async deleteScheduling(@Param('schedulingId') schedulingId: string) {
    return {
      message: await this.schedulingService.deleteScheduling(schedulingId),
    };
  }
}
