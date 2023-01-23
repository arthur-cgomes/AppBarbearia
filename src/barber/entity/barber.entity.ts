import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToOne } from 'typeorm';
import { BarberShop } from '../../barber-shop/entity/barber-shop.entity';
import { BaseCollection } from '../../common/entity/base.entity';

@Entity()
export class Barber extends BaseCollection {
  @ApiProperty()
  @IsNotEmpty()
  @Column({ length: 11, unique: true})
  cpf: string;
  
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

  @BeforeInsert()
  @BeforeUpdate()
  format = () => {
    if (this.phone) this.phone = this.phone.replace(/[^\d]+/g, '');
  };
}
