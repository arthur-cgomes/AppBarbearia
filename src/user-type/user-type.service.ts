import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, In, Repository } from 'typeorm';
import { CreateUserTypeDto } from './dto/create-user-type.dto';
import { GetAllUserTypesResponseDto } from './dto/get-all-user-type.dto';
import { UpdateUserUserTypeDto } from './dto/update-user-type.dto';
import { UserType } from './entity/user-type.entity';

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
    id: string,
    updateUserUserTypeDto: UpdateUserUserTypeDto,
  ): Promise<UserType> {
    await this.getUserTypeById(id);

    return await (
      await this.usertypeRepository.preload({
        id,
        ...updateUserUserTypeDto,
      })
    ).save();
  }

  public async getUserTypeById(id: string): Promise<UserType> {
    const user_type = await this.usertypeRepository.findOne({
      where: { id },
    });
    if (!user_type)
      throw new NotFoundException('user type with this id not found');

    return user_type;
  }

  public async getUserTypesByIds(ids: string[]): Promise<UserType[]> {
    return await this.usertypeRepository.findBy({ id: In(ids) });
  }

  public async getAllUserType(
    take: number,
    skip: number,
    search?: string,
  ): Promise<GetAllUserTypesResponseDto> {
    const conditions: FindManyOptions<UserType> = {
      take,
      skip,
    };

    if (search) {
      conditions.where = { name: ILike('%' + search + '%') };
    }

    const [usertypes, count] = await this.usertypeRepository.findAndCount(
      conditions,
    );

    if (usertypes.length == 0) {
      return { skip: null, total: 0, usertypes };
    }
    const over = count - Number(take) - Number(skip);
    skip = over <= 0 ? null : Number(skip) + Number(take);

    return { skip, total: count, usertypes };
  }

  public async deleteUserType(id: string): Promise<string> {
    const userType = await this.usertypeRepository.findOne({
      where: { id },
    });
    if (!userType)
      throw new NotFoundException('user type with this id not found');

    await this.usertypeRepository.remove(userType);

    return 'removed';
  }
}
