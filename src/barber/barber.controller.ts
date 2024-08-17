import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  Put,
  Get,
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
import { DeleteResponseDto } from '../common/dto/delete-response.dto';
import { BarberService } from './barber.service';
import { BarberDto } from './dto/barber.dto';
import { CreateBarberDto } from './dto/create-barber.dto';
import { GetAllBarbersResponseDto } from './dto/get-all-barber-response.dto';
import { UpdateBarberDto } from './dto/update-barber.dto';

@ApiBearerAuth()
@ApiTags('Barber')
@Controller('barber')
export class BarberController {
  constructor(private readonly barberService: BarberService) {}

  @UseGuards(AuthGuard())
  @Post()
  @ApiOperation({
    summary: 'Cria um novo barbeiro',
  })
  @ApiCreatedResponse({ type: BarberDto })
  @ApiConflictResponse({
    description: 'Barbeiro já cadastrado',
  })
  async createBarber(@Body() createBarberDto: CreateBarberDto) {
    return await this.barberService.createBarber(createBarberDto);
  }

  @UseGuards(AuthGuard())
  @Put('/:barberId')
  @ApiOperation({
    summary: 'Atualiza um barbeiro',
  })
  @ApiCreatedResponse({ type: BarberDto })
  @ApiNotFoundResponse({ description: 'Barbeiro não encontrado' })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
  })
  async updateBarber(
    @Param('barberId') barberId: string,
    @Body() updateBarberDto: UpdateBarberDto,
  ) {
    return await this.barberService.updateBarber(barberId, updateBarberDto);
  }

  @Get('/:barberId')
  @ApiOperation({
    summary: 'Retorna um barbeiro pelo id',
  })
  @ApiCreatedResponse({ type: BarberDto })
  @ApiNotFoundResponse({ description: 'Barbeiro não encontrado' })
  async getBarberById(@Param('barberId') barberId: string) {
    return await this.barberService.getBarberById(barberId);
  }

  @Get()
  @ApiOperation({
    summary: 'Retorna todos os barbeiros',
  })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'barbershopId', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiOkResponse({ type: GetAllBarbersResponseDto })
  async getAllBarbers(
    @Query('take') take = 10,
    @Query('skip') skip = 0,
    @Query('barbershopId') barbershopId?: string,
    @Query('search') search?: string,
  ) {
    return await this.barberService.getAllBarbers(
      take,
      skip,
      barbershopId,
      search,
    );
  }

  @UseGuards(AuthGuard())
  @Delete('/:barberId')
  @ApiOperation({
    summary: 'Exclui um barbeiro',
  })
  @ApiOkResponse({ type: DeleteResponseDto })
  @ApiNotFoundResponse({ description: 'Barbeiro não encontrado' })
  async deleteBarberById(@Param('barberId') barberId: string) {
    return { message: await this.barberService.deleteBarberById(barberId) };
  }
}
