import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { User } from '../../user/entity/user.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne } from 'typeorm';
import { BaseCollection } from '../../common/entity/base.entity';
import { Scheduling } from 'src/scheduling/entity/scheduling.entity';

@Entity()
export class BarberShop extends BaseCollection {
  @ApiProperty()
  @IsNotEmpty()
  @Column({ length: 255 })
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @Column({ length: 14 })
  cnpj: string;

  @ApiProperty()
  @IsNotEmpty()
  @Column({ type: 'text', default: null })
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @Column({ length: 20, default: null })
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @Column({ name: 'Email', length: 255, default: null })
  @IsEmail()
  email: string;

  @ApiProperty({ type: () => User })
  @IsNotEmpty()
  @ManyToOne(() => User, (user) => user.barbershops)
  user: User;

  @ApiProperty({ type: () => Scheduling })
  @IsNotEmpty()
  @ManyToOne(() => Scheduling, (scheduling) => scheduling.barbershops)
  schedulings: Scheduling;

  @BeforeInsert()
  @BeforeUpdate()
  format = () => {
    if (this.phone) this.phone = this.phone.replace(/[^\d]+/g, '');
  };
}
