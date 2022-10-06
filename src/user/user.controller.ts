import { Controller, Post, Body } from '@nestjs/common';
import { ApiConflictResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
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
}
