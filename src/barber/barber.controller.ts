import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteResponseDto } from '../common/dto/delete-response.dto';
import { BarberService } from './barber.service';
import { BarberDto } from './dto/barber.dto';
import { CreateBarberDto } from './dto/create-barber.dto';
import { GetAllBarberResponseDto } from './dto/get-all-barber-response.dto';

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
    description: 'Barbearia já cadastrada',
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

  @Get()
  @ApiOperation({
    summary: 'Buscar todas as barbearias',
  })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiOkResponse({ type: GetAllBarberResponseDto })
  async GetAllPrototypingValidation(
    @Query('take') take: number,
    @Query('skip') skip: number,
    @Query('search') search: string,
  ) {
    return await this.barberService.getAllBarbers(take, skip, search);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Exclui uma validação de protótipos',
  })
  @ApiOkResponse({ type: DeleteResponseDto })
  @ApiNotFoundResponse({
    description: 'Validação de protótipos não encontrada',
  })
  async DeletePrototypingValidation(@Param('id') id: string) {
    return {
      message: await this.barberService.deleteBarber(id),
    };
  }
}
