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

  @Post()
  @ApiOperation({
    summary: 'Criar um BarbarShop',
  })
  @ApiCreatedResponse({ type: BarberShopDto })
  @ApiConflictResponse({
    description: 'Uma Barbershop com esse nome já existe',
  })
  async CreateBarberShop(@Body() barbershop: CreateBarberShopDto) {
    return await this.barbershopService.createBarberShop(barbershop);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualiza uma BarbersShop',
  })
  @ApiOkResponse({ type: BarberShopDto })
  @ApiNotFoundResponse({ description: 'BarberShop não encontrada' })
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
    summary: 'Retorna uma BarberShop pelo id',
  })
  @ApiOkResponse({ type: BarberShopDto })
  @ApiNotFoundResponse({ description: 'BarberShop não encontrada' })
  async GetBarberShop(@Param('id') id: string) {
    return await this.barbershopService.getBarberShopById(id);
  }

  @Get()
  @ApiOperation({
    summary: 'Retorna todas as Barbershops',
  })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiOkResponse({ type: GetAllBarberShopResponseDto })
  async GetAllBarberShop(
    @Query('take') take = 10,
    @Query('skip') skip = 0,
    @Query('search') search?: string,
  ) {
    return await this.barbershopService.getAllBarberShop(take, skip, search);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Deleta uma BarberShop pelo id',
  })
  @ApiOkResponse({ type: DeleteResponseDto })
  @ApiNotFoundResponse({
    description: 'BarberShop não encontrada',
  })
  async DeleteBarberShop(@Param('id') id: string) {
    return { message: await this.barbershopService.deleteBarberShop(id) };
  }
}
