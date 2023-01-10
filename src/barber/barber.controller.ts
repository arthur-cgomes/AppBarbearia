import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { BarberService } from './barber.service';
import { BarberDto } from './dto/barber.dto';
import { CreateBarberDto } from './dto/create-barber.dto';

@ApiTags('Barber')
@Controller('barber')
export class BarberController {
  constructor(private readonly barberService: BarberService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar um novo barbeiro',
  })
  @ApiCreatedResponse({
    type: BarberDto,
  })
  @ApiConflictResponse({
    description: 'Barbeariaa já cadastrada',
  })
  async createbarber(@Body() createBarberDto: CreateBarberDto) {
    return await this.barberService.createBarber(createBarberDto);
  }

  @Get(':barberId')
  @ApiOperation({
    summary: 'Buscar um barbeiro pelo id',
  })
  @ApiOkResponse({
    type: BarberDto,
  })
  @ApiNotFoundResponse({
    description: 'Barbeiro não encontrado',
  })
  async getBarberById(@Param('barberId') barberId: string) {
    return await this.barberService.getBarberById(barberId);
  }
}
