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
import { BarberShopService } from './barber-shop.service';
import { BarberShopDto } from './dto/barbershop.dto';
import { CreateBarberShopDto } from './dto/create-barbershop.dto';
import { GetAllBarberShopResponseDto } from './dto/get-all-barbershop.dto';
import { UpdateBarberShopDto } from './dto/update-barbershop.dto';

@ApiBearerAuth()
@ApiTags('BarberShop')
@Controller('barbershop')
export class BarberShopController {
  constructor(private readonly barbershopService: BarberShopService) {}

  @UseGuards(AuthGuard())
  @Post()
  @ApiOperation({
    summary: 'Cria uma barbearia',
  })
  @ApiCreatedResponse({ type: BarberShopDto })
  @ApiConflictResponse({
    description: 'Barbearia com esse CNPJ já existe',
  })
  async createBarberShop(@Body() barbershop: CreateBarberShopDto) {
    return await this.barbershopService.createBarberShop(barbershop);
  }

  @UseGuards(AuthGuard())
  @Put('/:barbershopId')
  @ApiOperation({
    summary: 'Atualiza uma barbearia',
  })
  @ApiOkResponse({ type: BarberShopDto })
  @ApiNotFoundResponse({ description: 'Barbearia não encontrada' })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
  })
  async UpdateBarberShop(
    @Param('barbershopId') barbershopId: string,
    @Body() updateBarberShopDto: UpdateBarberShopDto,
  ) {
    return await this.barbershopService.updateBarberShop(
      barbershopId,
      updateBarberShopDto,
    );
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Retorna uma barbearia pelo id',
  })
  @ApiOkResponse({ type: BarberShopDto })
  @ApiNotFoundResponse({ description: 'Barbearia não encontrada' })
  async GetBarberShop(@Param('barbershopId') barbershopId: string) {
    return await this.barbershopService.getBarberShopById(barbershopId);
  }

  @Get()
  @ApiOperation({
    summary: 'Retorna todas as barbearias',
  })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'document', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiOkResponse({ type: GetAllBarberShopResponseDto })
  async GetAllBarberShops(
    @Query('take') take = 10,
    @Query('skip') skip = 0,
    @Query('document') document?: string,
    @Query('search') search?: string,
  ) {
    return await this.barbershopService.getAllBarberShops(
      take,
      skip,
      document,
      search,
    );
  }

  @UseGuards(AuthGuard())
  @Delete('/:barbershopId')
  @ApiOperation({
    summary: 'Exclui uma barbearia',
  })
  @ApiOkResponse({ type: DeleteResponseDto })
  @ApiNotFoundResponse({
    description: 'BarberShop não encontrada',
  })
  async deleteBarberShopById(@Param('barbershopId') barbershopId: string) {
    return {
      message: await this.barbershopService.deleteBarberShopById(barbershopId),
    };
  }
}
