import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, Repository } from 'typeorm';
import { CreateUserTypeDto } from './dto/create-user-type.dto';
import { GetAllUserTypesResponseDto } from './dto/get-all-user-type.dto';
import { UpdateUserUserTypeDto } from './dto/update-user-type.dto';
import { UserType } from './entity/user-type.entity';
import { UserTypeEnum } from '../common/enum/user-type.enum';

@Injectable()
export class UserTypeService {
  constructor(
    @InjectRepository(UserType)
    private readonly usertypeRepository: Repository<UserType>,
  ) {}

  public async createUserType(
    createUserTypeDto: CreateUserTypeDto,
  ): Promise<UserType> {
    const checkUserType = await this.usertypeRepository.findOne({
      where: { name: createUserTypeDto.name },
    });

    if (checkUserType)
      throw new ConflictException('user type with that name already exists');

    return await this.usertypeRepository
      .create({ ...createUserTypeDto })
      .save();
  }

  public async updateUserType(
    userTypeId: string,
    updateUserUserTypeDto: UpdateUserUserTypeDto,
  ): Promise<UserType> {
    await this.getUserTypeById(userTypeId);

    return await (
      await this.usertypeRepository.preload({
        id: userTypeId,
        ...updateUserUserTypeDto,
      })
    ).save();
  }

  public async getUserTypeById(userTypeId: string): Promise<UserType> {
    const userType = await this.usertypeRepository.findOne({
      where: { id: userTypeId },
    });

    if (!userType)
      throw new NotFoundException('user type with this id not found');

    return userType;
  }

  public async getUserTypesByIds(ids: string[]): Promise<UserType[]> {
    return await this.usertypeRepository.findBy({ id: In(ids) });
  }

  public async getAllUserTypes(
    take: number,
    skip: number,
    sort: string,
    order: 'ASC' | 'DESC',
    search?: string,
  ): Promise<GetAllUserTypesResponseDto> {
    const conditions: FindManyOptions<UserType> = {
      take,
      skip,
      order: {
        [sort]: order,
      },
    };

    if (search) {
      const searchValue = Object.values(UserTypeEnum).find((value) =>
        value.includes(search.toLowerCase()),
      );
      if (searchValue) {
        conditions.where = { name: searchValue };
      }
    }

    const [usertypes, count] =
      await this.usertypeRepository.findAndCount(conditions);

    if (usertypes.length == 0) {
      return { skip: null, total: 0, usertypes };
    }
    const over = count - Number(take) - Number(skip);
    skip = over <= 0 ? null : Number(skip) + Number(take);

    return { skip, total: count, usertypes };
  }

  public async deleteUserTypeById(userTypeId: string): Promise<string> {
    const userType = await this.getUserTypeById(userTypeId);
    await this.usertypeRepository.remove(userType);

    return 'removed';
  }
}
