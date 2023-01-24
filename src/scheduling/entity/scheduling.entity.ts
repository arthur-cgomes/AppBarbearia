import { ApiProperty } from '@nestjs/swagger';
import { BaseCollection } from '../../common/entity/base.entity';
import { Services } from '../../services/entity/services.entity';
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
  user: User;

  @ApiProperty({ type: () => BarberShop })
  @ManyToOne(() => BarberShop, (barbershop) => barbershop.scheduling)
  barbershops: BarberShop;

  @ApiProperty({ type: () => Barber })
  @ManyToOne(() => Barber, (barber) => barber.scheduling)
  barber: Barber;

  @ApiProperty({ type: () => Services })
  @ManyToOne(() => Services, (service) => service.schedulings)
  services: Services;
}
