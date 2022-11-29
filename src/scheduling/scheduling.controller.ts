import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteResponseDto } from 'src/common/dto/delete-response.dto';
import { CreateSchedulingDto } from './dto/create-scheduling.dto';
import { SchedulingService } from './scheduling.service';

@ApiBearerAuth()
@ApiTags('Scheduling')
@Controller('schedulings')
export class SchedulingController {
    constructor(
        private readonly schedulingService: SchedulingService,
    ) { }

    @Post()
    @ApiOperation({
        summary: 'Agenda um horário',
    })
    //@ApiCreatedResponse({ type: SchedulingDto })
    //@ApiConflictResponse({
    //    desctiption: 'Horário já agendado',
    //})
    public async createScheduling(
        @Body() createSchedulingDto: CreateSchedulingDto
    ) {
        return await this.schedulingService.createScheduling(createSchedulingDto);
    }

    @Put(':schedulingId')
    @ApiOperation({
        summary: 'Atualiza um horário',
    })
    //@ApiOkResponse({ type: SchedulingDto })
    @ApiNotFoundResponse({
        description: 'Horário não encontrado',
    })
    @ApiBadRequestResponse({
        description: 'Dados inválidos',
    })
    public async updateScheduling(
        @Param('schedulingId') schedulingId: string,
        @Body() updateSchedulingDto: CreateSchedulingDto,
    ) {
        return await this.schedulingService.updateScheduling(schedulingId, updateSchedulingDto);
    }

    @Delete(':schedulingId')
    @ApiOperation({
        summary: 'Exclui um horário',
    })
    @ApiOkResponse({ type: DeleteResponseDto })
    @ApiNotFoundResponse({ description: 'Horário não encontrado' })
    public async deleteScheduling(
        @Param('schedulingId') schedulingId: string,
    ) {
        return { message: await this.schedulingService.deleteScheduling(schedulingId) };
    }
}
