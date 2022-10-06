import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  MockRepository,
  repositoryMockFactory,
} from '../../utils/mock/test.util';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entity/user.entity';
import { UserService } from '../user.service';

describe('UserService', () => {
  let service: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: repositoryMockFactory<User>(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);

    repositoryMock = module.get(getRepositoryToken(User));
  });

  beforeEach(() => jest.clearAllMocks());

  const user: User = {
    id: '12313123-123123a-abcde',
    email: 'email@teste.com.br',
    name: 'Arthur Gomes',
    birthDate: new Date(),
    phone: '(99)12341-2222',
  } as User;

  describe('createUser', () => {
    const createUserDto: CreateUserDto = {
      email: 'email@teste.com.br',
      password: '123456',
      name: 'Arthur Gomes',
      birthDate: new Date(),
      phone: '(99)12341-2222',
    };

    it('Should successfully create a new user', async () => {
      repositoryMock.findOne = jest.fn();
      repositoryMock.create = jest.fn().mockReturnValue({ save: () => user });

      const result = await service.createUser(
        createUserDto,
      );

      expect(result).toStrictEqual(user);
      expect(repositoryMock.create).toHaveBeenCalledWith({
        ...createUserDto,
      });
    });





  })
});
