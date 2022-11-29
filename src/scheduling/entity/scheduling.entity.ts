import { ApiProperty } from '@nestjs/swagger';
import { BaseCollection } from '../../common/entity/base.entity';
import { Services } from '../../services/entity/services.entity';
import { User } from '../../user/entity/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BarberShop } from '../../barber-shop/entity/barber-shop.entity';

@Entity()
export class Scheduling extends BaseCollection {
  @ApiProperty()
  @Column({ type: 'timestamp' })
  date: Date;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.scheduling)
  user: User;

  @ApiProperty({ type: () => Services })
  @ManyToOne(() => Services, (services) => services.scheduling)
  services: Services;

  @ApiProperty({ type: () => BarberShop })
  @ManyToOne(() => BarberShop, (barbershop) => barbershop.scheduling)
  barbershop: BarberShop;
}
