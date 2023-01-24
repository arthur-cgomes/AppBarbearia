import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { BarberShop } from '../../barber-shop/entity/barber-shop.entity';
import { BaseCollection } from '../../common/entity/base.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToOne } from 'typeorm';

@Entity()
export class Barber extends BaseCollection {
  @ApiProperty()
  @IsNotEmpty()
  @Column({ length: 20, default: null }) // Adicionar mascara de CPF e limitar a 11 caracteres
  cpf: string;

  @ApiProperty()
  @IsNotEmpty()
  @Column({ length: 255 })
  name: string;

  @ApiProperty()
  @Column()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Column({ length: 20 })
  phone: string;

  @ApiProperty({ type: () => BarberShop })
  @IsNotEmpty()
  @OneToOne(() => BarberShop, (barbershop) => barbershop.barbers)
  barbershops: BarberShop;

  @BeforeInsert()
  @BeforeUpdate()
  format = () => {
    if (this.phone) this.phone = this.phone.replace(/[^\d]+/g, '');
  };
}
