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
import { CreateUserTypeDto } from './dto/create-user-type.dto';
import { GetAllUserTypesResponseDto } from './dto/get-all-user-type.dto';
import { UpdateUserUserTypeDto } from './dto/update-user-type.dto';
import { UserTypeDto } from './dto/user-type.dto';
import { UserTypeService } from './user-type.service';

@ApiBearerAuth()
@ApiTags('User-type')
@Controller('user-types')
export class UserTypeController {
  constructor(private readonly usertypeService: UserTypeService) {}

  @Post()
  @ApiOperation({
    summary: 'Cria um tipo de usuário',
  })
  @ApiCreatedResponse({ type: UserTypeDto })
  @ApiConflictResponse({
    description: 'Tipo de usuário com este nome já existe',
  })
  async createUserType(@Body() createUserTypeDto: CreateUserTypeDto) {
    return await this.usertypeService.createUserType(createUserTypeDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualiza um tipo de usuário',
  })
  @ApiOkResponse({ type: UserTypeDto })
  @ApiNotFoundResponse({ description: 'Tipo de usuário não encontrado' })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
  })
  async updateUserType(
    @Param('id') id: string,
    @Body() updateUserUserTypeDto: UpdateUserUserTypeDto,
  ) {
    return await this.usertypeService.updateUserType(id, updateUserUserTypeDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retorna um tipo de usuário pelo id',
  })
  @ApiOkResponse({ type: UserTypeDto })
  @ApiNotFoundResponse({ description: 'Tipo de usuário não encontrado' })
  async getUserTypeyId(@Param('id') id: string) {
    return await this.usertypeService.getUserTypeById(id);
  }

  @Get()
  @ApiOperation({
    summary: 'Retorna todos os tipos usuários',
  })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiOkResponse({ type: GetAllUserTypesResponseDto })
  async getAllUsersType(
    @Query('take') take = 10,
    @Query('skip') skip = 0,
    @Query('search') search?: string,
  ) {
    return await this.usertypeService.getAllUserType(take, skip, search);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Exclui um tipo de usuário',
  })
  @ApiOkResponse({ type: DeleteResponseDto })
  @ApiNotFoundResponse({ description: 'Tipo de usuário não encontrado' })
  async deleteUserTypeId(@Param('id') id: string) {
    return { message: await this.usertypeService.deleteUserType(id) };
  }
}
