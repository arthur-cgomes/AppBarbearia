import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { UserTypeService } from '../user-type/user-type.service';
import { FindManyOptions, In, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { GetAllUsersResponseDto } from './dto/get-all-user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entity/user.entity';
import { UpdateManyToManyDto } from 'src/common/dto/update-many-to-many.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userTypeService: UserTypeService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    const checkUser = await this.userRepository.findOne({
      where: [{ email: createUserDto.email }],
    });

    if (checkUser) {
      throw new ConflictException('user already exists');
    }

    return await this.userRepository.create(createUserDto).save();
  }

  public async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: [{ id: userId }],
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return await (
      await this.userRepository.preload({
        id: userId,
        ...updateUserDto,
      })
    ).save();
  }

  public async updateUserType(
    userId: string,
    toAddOrRemoveDto: UpdateManyToManyDto,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: [{ id: userId }],
      relations: ['userTypes'],
    });

    if (!user) {
      throw new NotFoundException('user with this externalId not found');
    }

    const userTypesToAdd = await this.userTypeService.getUserTypesByIds(
      toAddOrRemoveDto.toAdd,
    );

    if (userTypesToAdd.length !== toAddOrRemoveDto.toAdd.length)
      throw new BadRequestException('toAdd list has some invalid id');

    user.userTypes = user.userTypes.concat(userTypesToAdd);

    user.userTypes = user.userTypes.filter(
      ({ id: userTypeId }) =>
        !toAddOrRemoveDto.toRemove.find((ut) => userTypeId == ut),
    );

    return await (await this.userRepository.preload(user)).save();
  }

  public async getUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: [{ id: userId }],
    });

    if (!user) {
      throw new NotFoundException('user with this id not found');
    }

    return user;
  }

  public async getUserByIds(ids: string[]): Promise<User[]> {
    return await this.userRepository.findBy({ id: In(ids) });
  }

  public async getAllUsers(
    take: number,
    skip: number,
    userId: string,
  ): Promise<GetAllUsersResponseDto> {
    const conditions: FindManyOptions<User> = {
      take,
      skip,
    };

    if (userId) {
      conditions.where = { id: userId };
    }

    const [users, count] = await this.userRepository.findAndCount(conditions);

    if (users.length == 0) {
      return { skip: null, total: 0, users };
    }
    const over = count - Number(take) - Number(skip);
    skip = over <= 0 ? null : Number(skip) + Number(take);

    return { skip, total: count, users };
  }

  public async deleteUser(userId: string): Promise<string> {
    const user = await this.userRepository.findOne({
      where: [{ id: userId }],
    });

    if (!user) throw new NotFoundException('user with this id not found');

    await this.userRepository.remove(user);

    return 'removed';
  }
}
