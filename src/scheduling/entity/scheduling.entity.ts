import { ApiProperty } from '@nestjs/swagger';
import { BaseCollection } from '../../common/entity/base.entity';
import { Service } from '../../services/entity/services.entity';
import { User } from '../../user/entity/user.entity';
import { Entity, ManyToOne } from 'typeorm';
import { BarberShop } from '../../barber-shop/entity/barber-shop.entity';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class Scheduling extends BaseCollection {
  @ApiProperty({ type: () => User })
  @IsNotEmpty()
  @ManyToOne(() => User, (user) => user.schedulings)
  users: User;

  @ApiProperty({ type: () => Service })
  @ManyToOne(() => Service, (service) => service.schedulings)
  services: Service;

  @ApiProperty({ type: () => BarberShop })
  @ManyToOne(() => BarberShop, (barbershop) => barbershop.schedulings)
  barbershops: BarberShop;
}
