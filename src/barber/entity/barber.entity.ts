import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Scheduling } from 'src/scheduling/entity/scheduling.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { BarberShop } from '../../barber-shop/entity/barber-shop.entity';
import { BaseCollection } from '../../common/entity/base.entity';

@Entity()
export class Barber extends BaseCollection {
  @ApiProperty()
  @IsNotEmpty()
  @Column({ length: 255 })
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @Column({ length: 20, default: null })
  phone: string;

  @ApiProperty({ type: () => BarberShop })
  @IsNotEmpty()
  @OneToOne(() => BarberShop, (barbershop) => barbershop.barber)
  barbershop: BarberShop;

  @ApiProperty({ type: () => Scheduling })
  @IsNotEmpty()
  @ManyToOne(() => Scheduling, (scheduling) => scheduling.barbers)
  schedulings: Scheduling;

  @BeforeInsert()
  @BeforeUpdate()
  format = () => {
    if (this.phone) this.phone = this.phone.replace(/[^\d]+/g, '');
  };
}
