import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { BarberShop } from '../../barber-shop/entity/barber-shop.entity';
import { BaseCollection } from '../../common/entity/base.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToOne } from 'typeorm';
import { Scheduling } from '../../scheduling/entity/scheduling.entity';

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
  @OneToOne(() => BarberShop, (barbershop) => barbershop.barber)
  barbershop: BarberShop;

  @ApiProperty({ type: () => Scheduling })
  @OneToOne(() => Scheduling, (scheduling) => scheduling.barber)
  scheduling: Scheduling;

  @BeforeInsert()
  @BeforeUpdate()
  format = () => {
    if (this.phone) this.phone = this.phone.replace(/[^\d]+/g, '');
  };
}
