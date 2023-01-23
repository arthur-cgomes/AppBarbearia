import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, In, Repository } from 'typeorm';
import { CreateServiceDto } from './dto/create-services.dto';
import { GetAllServicesResponseDto } from './dto/get-all-services.dto';
import { UpdateServiceDto } from './dto/update-services.dto';
import { Service } from './entity/services.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly servicesRepository: Repository<Service>,
  ) {}

  public async createService(
    createServiceDto: CreateServiceDto,
  ): Promise<Service> {
    const chekService = await this.servicesRepository.findOne({
      where: { name: createServiceDto.name },
    });

    if (chekService) {
      throw new ConflictException('services with that name already exists');
    }

    return await this.servicesRepository.create({ ...createServiceDto }).save();
  }

  public async updateService(
    id: string,
    updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    await this.getServiceById(id);

    return await (
      await this.servicesRepository.preload({
        id,
        ...updateServiceDto,
      })
    ).save();
  }

  public async getServiceById(id: string): Promise<Service> {
    const service = await this.servicesRepository.findOne({
      where: { id },
    });
    if (!service) throw new NotFoundException('service with this id not found');

    return service;
  }

  public async getServiceByIds(ids: string[]): Promise<Service[]> {
    return await this.servicesRepository.findBy({ id: In(ids) });
  }

  public async getAllServices(
    take: number,
    skip: number,
    serviceId: string,
    search?: string,
  ): Promise<GetAllServicesResponseDto> {
    const conditions: FindManyOptions<Service> = {
      take,
      skip,
    };

    if (serviceId) {
      conditions.where = { id: serviceId };
    } else if (search) {
      conditions.where = { name: ILike('%' + search + '%') };
    }

    const [services, count] = await this.servicesRepository.findAndCount(
      conditions,
    );

    if (services.length == 0) {
      return { skip: null, total: 0, services };
    }
    const over = count - Number(take) - Number(skip);
    skip = over <= 0 ? null : Number(skip) + Number(take);

    return { skip, total: count, services };
  }

  public async deleteService(serviceId: string): Promise<string> {
    const deleteService = await this.servicesRepository.findOne({
      where: [{ id: serviceId }],
    });

    if (!deleteService)
      throw new NotFoundException('service with this id not found');

    await this.servicesRepository.remove(deleteService);

    return 'removed';
  }
}
