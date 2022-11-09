import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateServiceDto } from './dto/create-services.dto';
import { GetAllServicesResponseDto } from './dto/get-all-services.dto';
import { UpdateServiceDto } from './dto/update-services.dto';
import { ServicesService } from './services.service';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }

    @Post()
    @ApiOperation({
        summary: 'Cria um serviço',
    })
    //@ApiCreatedResponse({ type: InstitutionDto })
    @ApiConflictResponse({
        description: 'Serviço com esse nome já existe',
    })
    async createServices(
        @Body() createServiceDto: CreateServiceDto,
    ) {
        return await this.servicesService.createService(createServiceDto);
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Atualiza um serviço',
    })
    //@ApiOkResponse({ type: UserTypeDto })
    @ApiNotFoundResponse({ description: 'Serviço não encontrado' })
    @ApiBadRequestResponse({
        description: 'Dados inválidos',
    })
    async updateService(
        @Param('id') id: string,
        @Body() updateServiceDto: UpdateServiceDto,
    ) {
        return await this.servicesService.updateService(id, updateServiceDto);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Retorna um serviço pelo id',
    })
    //@ApiOkResponse({ type: UserTypeDto })
    @ApiNotFoundResponse({ description: 'Serviço não encontrado' })
    async getServiceById(
        @Param('id') id: string,
    ) {
        return await this.servicesService.getServiceById(id);
    }

    @Get()
    @ApiOperation({
        summary: 'Retorna todos os serviços',
    })
    @ApiQuery({ name: 'take', required: false })
    @ApiQuery({ name: 'skip', required: false })
    @ApiQuery({ name: 'serviceId', required: false })
    @ApiQuery({ name: 'search', required: false })
    @ApiOkResponse({ type: GetAllServicesResponseDto })
    async getAllServices(
        @Query('take') take = 10,
        @Query('skip') skip = 0,
        @Query('serviceId') serviceId: string,
        @Query('search') search?: string,
    ) {
        return await this.servicesService.getAllServices(take, skip, serviceId, search);
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Exclui um serviço',
    })
    //@ApiOkResponse({ type: DeleteResponseDto })
    @ApiNotFoundResponse({ description: 'Serviço não encontrado' })
    async deleteServiceById(
        @Param('id') id: string,
    ) {
        return { message: await this.servicesService.deleteServiceById(id) };
    }
}
