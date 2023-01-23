import { Controller, Post, Body, Delete, Param } from '@nestjs/common';
import { ApiConflictResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteResponseDto } from 'src/common/dto/delete-response.dto';
import { BarberService } from './barber.service';
import { CreateBarberDto } from './dto/create-barber.dto';

@ApiTags('Barber')
@Controller('barbers')
export class BarberController {
    constructor(
        private readonly barberService: BarberService
    ) { }

    @Post()
    @ApiOperation({
        summary: 'Adiona um novo barbeiro',
    })
    //@ApiCreatedResponse({ type: * })
    @ApiConflictResponse({
        description: 'Barbeiro já cadastrado',
    })
    async createBarber(@Body() createBarberDto: CreateBarberDto) {
        return await this.barberService.createBarber(createBarberDto);
    }

    @Delete(':barberId')
    @ApiOperation({
        summary: 'Exclui um barbeiro',
    })
    @ApiOkResponse({ type: DeleteResponseDto })
    @ApiNotFoundResponse({ description: 'Barbeiro não encontrado' })
    async deleteBarber(@Param('barberId') barberId: string) {
        return { message: await this.barberService.deleteBarber(barberId) };
    }
}
