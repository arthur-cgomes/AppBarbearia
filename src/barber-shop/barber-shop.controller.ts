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
import { DeleteResponseDto } from '../common/dto/delete-response.dto';
import { BarberShopService } from './barber-shop.service';
import { BarberShopDto } from './dto/barbershop.dto';
import { CreateBarberShopDto } from './dto/create-barbershop.dto';
import { GetAllBarberShopResponseDto } from './dto/get-all-barbershop.dto';
import { UpdateBarberShopDto } from './dto/update-barbershop.dto';

@ApiBearerAuth()
@ApiTags('BarberShop')
@Controller('barbershops')
export class BarberShopController {
  constructor(private readonly barbershopService: BarberShopService) {}

  @Post(':userId')
  @ApiOperation({
    summary: 'Cria uma barbearia',
  })
  @ApiCreatedResponse({ type: BarberShopDto })
  @ApiConflictResponse({
    description: 'Uma barbearia com esse CNPJ já existe',
  })
  async CreateBarberShop(
    @Body() barbershop: CreateBarberShopDto,
    @Param('userId') userId: string,
  ) {
    return await this.barbershopService.createBarberShop(barbershop, userId);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualiza uma barbearia',
  })
  @ApiOkResponse({ type: BarberShopDto })
  @ApiNotFoundResponse({ description: 'Barbearia não encontrada' })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
  })
  async UpdateBarberShop(
    @Param('id') id: string,
    @Body() updateBarberShopDto: UpdateBarberShopDto,
  ) {
    return await this.barbershopService.updateBarberShop(
      id,
      updateBarberShopDto,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retorna uma barbearia pelo id',
  })
  @ApiOkResponse({ type: BarberShopDto })
  @ApiNotFoundResponse({ description: 'Barbearia não encontrada' })
  async GetBarberShop(@Param('id') id: string) {
    return await this.barbershopService.getBarberShopById(id);
  }

  @Get()
  @ApiOperation({
    summary: 'Retorna todas as barbearias',
  })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'barbershopId', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiOkResponse({ type: GetAllBarberShopResponseDto })
  async GetAllBarberShop(
    @Query('take') take = 10,
    @Query('skip') skip = 0,
    @Query('barbershopId') barbershopId: string,
    @Query('search') search?: string,
  ) {
    return await this.barbershopService.getAllBarberShop(
      take,
      skip,
      barbershopId,
      search,
    );
  }

  @Delete(':barbershopId')
  @ApiOperation({
    summary: 'Exclui uma barbearia',
  })
  @ApiOkResponse({ type: DeleteResponseDto })
  @ApiNotFoundResponse({
    description: 'BarberShop não encontrada',
  })
  async deleteBarberShop(@Param('barbershopId') barbershopId: string) {
    return {
      message: await this.barbershopService.deleteBarberShop(barbershopId),
    };
  }
}
