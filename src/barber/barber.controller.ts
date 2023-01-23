import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  Put,
  Get,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteResponseDto } from 'src/common/dto/delete-response.dto';
import { BarberService } from './barber.service';
import { CreateBarberDto } from './dto/create-barber.dto';
import { UpdateBarberDto } from './dto/update-barber.dto';

@ApiTags('Barber')
@Controller('barbers')
export class BarberController {
  constructor(private readonly barberService: BarberService) {}

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

  @Put(':barberId')
  @ApiOperation({
    summary: 'Atualiza um barbeiro',
  })
  //@ApiOkResponse({ type: * })
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

  @Get(':barberId')
  @ApiOperation({
    summary: 'Retorna um barbeiro pelo id',
  })
  //@ApiOkResponse({ type: * })
  @ApiNotFoundResponse({ description: 'Barbeiro não encontrado' })
  async getBarberbyId(@Param('barberId') barberId: string) {
    return await this.barberService.getBarberbyId(barberId);
  }

  //Fazer o getAllBarbers

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
