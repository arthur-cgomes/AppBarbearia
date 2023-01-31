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
import { DeleteResponseDto } from 'src/common/dto/delete-response.dto';
import { BarberService } from './barber.service';
import { BarberDto } from './dto/barber.dto';
import { CreateBarberDto } from './dto/create-barber.dto';
import { GetAllBarbersResponseDto } from './dto/get-all-barber-response.dto';
import { UpdateBarberDto } from './dto/update-barber.dto';

@ApiBearerAuth()
@ApiTags('Barber')
@Controller('barbers')
export class BarberController {
  constructor(private readonly barberService: BarberService) {}

  @UseGuards(AuthGuard())
  @Post()
  @ApiOperation({
    summary: 'Adiona um novo barbeiro',
  })
  @ApiCreatedResponse({ type: BarberDto })
  @ApiConflictResponse({
    description: 'Barbeiro já cadastrado',
  })
  async createBarber(@Body() createBarberDto: CreateBarberDto) {
    return await this.barberService.createBarber(createBarberDto);
  }

  @UseGuards(AuthGuard())
  @Put(':barberId')
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

  @UseGuards(AuthGuard())
  @Get(':barberId')
  @ApiOperation({
    summary: 'Retorna um barbeiro pelo id',
  })
  @ApiCreatedResponse({ type: BarberDto })
  @ApiNotFoundResponse({ description: 'Barbeiro não encontrado' })
  async getBarberById(@Param('barberId') barberId: string) {
    return await this.barberService.getBarberById(barberId);
  }

  @UseGuards(AuthGuard())
  @Get()
  @ApiOperation({
    summary: 'Retorna todos os barbeiros',
  })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'barberId', required: false })
  @ApiOkResponse({ type: GetAllBarbersResponseDto })
  async getAllBarbers(
    @Query('take') take = 10,
    @Query('skip') skip = 0,
    @Query('barberId') barberId?: string,
  ) {
    return await this.barberService.getAllBarbers(take, skip, barberId);
  }

  @UseGuards(AuthGuard())
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
