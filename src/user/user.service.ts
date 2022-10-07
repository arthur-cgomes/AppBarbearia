import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
            throw new ConflictException('user already exists');
        }

        return await this.userRepository.create(createUserDto).save();
    }

    public async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.userRepository.findOne({
            where: [
                { id: userId },
            ],
        });

        if (!user) {
            throw new NotFoundException('user not found');
        }

        return await (await this.userRepository.preload({
            id: userId,
            ...updateUserDto,
        })
        ).save();
    }

    public async getUserById(userId: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: [
                { id: userId },
            ],
        });

        if (!user) {
            throw new NotFoundException('user with this id not found');
          }
      

        return user;
    }


}
