import { Controller, Post, Body, Put, Param, Get } from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }

    @Post()
    @ApiOperation({
        summary: 'Cria um novo usuário',
    })
    //@ApiCreatedResponse({ type: UserDto })
    @ApiConflictResponse({
        description: 'Usuário já cadastrado',
    })
    async createUser(
        @Body() createUserDto: CreateUserDto,
    ) {
        return await this.userService.createUser(createUserDto);
    }

    @Put(':userId')
    @ApiOperation({
        summary: 'Atualiza um usuário',
    })
    //@ApiOkResponse({ type: UserDto })
    @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
    @ApiBadRequestResponse({
        description: 'Dados inválidos',
    })
    async updateUser(
        @Param('userId') userId: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return await this.userService.updateUser(userId, updateUserDto);
    }

    @Get(':userId')
    @ApiOperation({
        summary: 'Retorna um usuário pelo id',
    })
    //@ApiOkResponse({ type: UserDto })
    @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
    async getUserById(
        @Param('userId') userId: string
    ) {
        return await this.userService.getUserById(userId);
    }

}
