import { ApiProperty } from '@nestjs/swagger';
import { BaseCollection } from '../../common/entity/base.entity';
import { Service } from '../../services/entity/services.entity';
import { User } from '../../user/entity/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BarberShop } from '../../barber-shop/entity/barber-shop.entity';
import { IsNotEmpty } from 'class-validator';
import { Barber } from '../../barber/entity/barber.entity';

@Entity()
export class Scheduling extends BaseCollection {
  @ApiProperty()
  @IsNotEmpty()
  @Column({ name: 'scheduling', type: 'timestamp' })
  date: Date;

  @ApiProperty({ type: () => User })
  @IsNotEmpty()
  @ManyToOne(() => User, (user) => user.schedulings)
  users: User;

  @ApiProperty({ type: () => BarberShop })
  @ManyToOne(() => BarberShop, (barbershop) => barbershop.schedulings)
  barbershops: BarberShop;

  @ApiProperty({ type: () => Barber })
  @ManyToOne(() => Barber, (barber) => barber.schedulings)
  barbers: Barber;

  @ApiProperty({ type: () => Service })
  @ManyToOne(() => Service, (service) => service.schedulings)
  services: Service;

}
