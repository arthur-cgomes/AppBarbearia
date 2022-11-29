import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AddSchedulingDto } from './dto/add-scheduling.dto';
import { SchedulingService } from './scheduling.service';

@ApiBearerAuth()
@ApiTags('Scheduling')
@Controller('schedulings')
export class SchedulingController {
    constructor(
        private readonly schedulingService: SchedulingService,
    ) {}

    @Post()
    async createScheduling(
        @Body() addSchedulingDto: AddSchedulingDto,
    ) {
        return await this.schedulingService.createScheduling(addSchedulingDto);
    }

    @Delete(':schedulingId')
    async deleteScheduling(
        @Param('schedulingId') schedulingId: string,
        ) {
        return await this.schedulingService.deleteScheduling(schedulingId);
    }
}
