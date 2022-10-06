import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) { }

    public async createUser(createUserDto: CreateUserDto): Promise<User> {
        const checkUser = await this.userRepository.findOne({
            where: [
                { email: createUserDto.email },
            ],
        });

        if (checkUser) {
            throw new Error('User already exists');
        }

        return await this.userRepository.create(createUserDto).save();
    }
}
