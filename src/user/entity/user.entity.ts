import { ApiProperty } from '@nestjs/swagger';
import { BaseCollection } from '../../common/entity/base.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { UserType } from '../../user-type/entity/user-type.entity';
import { BarberShop } from '../../barber-shop/entity/barber-shop.entity';
import { Scheduling } from '../../scheduling/entity/scheduling.entity';
import * as bcrypt from 'bcrypt';

@Entity()
@Unique(['email', 'document'])
export class User extends BaseCollection {
  @ApiProperty({
    description: 'Nome do usuário',
    type: String,
  })
  @Column({ type: 'varchar', default: null, nullable: true })
  name: string;

  @ApiProperty({
    description: 'Data de nascimento do usuário',
    type: Date,
  })
  @Column({ type: 'timestamp', default: null, nullable: true })
  birthdate: Date;

  @ApiProperty({
    description: 'CPF do usuário',
    type: String,
  })
  @Column({ type: 'varchar', default: null, nullable: true })
  document: string;

  @ApiProperty({
    description: 'Email do usuário',
    type: String,
  })
  @Column({ type: 'varchar', default: null, nullable: true })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    type: String,
  })
  @Column({ type: 'varchar', default: null, nullable: true })
  password: string;

  @ApiProperty({
    description: 'Número de celular do usuário',
    type: String,
  })
  @Column({ length: 20, default: null, nullable: true })
  cellphone: string;

  @ApiProperty({
    description: 'Relacionamento com a tabela UserType',
    type: () => UserType,
  })
  @ManyToOne(() => UserType, (usertype) => usertype.user)
  userType: UserType;

  @ApiProperty({
    description: 'Relacionamento com a tabela BarberShop',
    type: () => BarberShop,
  })
  @OneToMany(() => BarberShop, (barbershop) => barbershop.user)
  barbershops: BarberShop[];

  @ApiProperty({
    description: 'Relacionamento com a tabela Scheduling',
    type: () => Scheduling,
  })
  @OneToMany(() => Scheduling, (scheduling) => scheduling.user)
  schedulings: Scheduling[];

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    if (this.password) {
      this.password = bcrypt.hashSync(this.password, 10);
    }
  }

  checkPassword = (attempt: string) => {
    if (!this.password) return false;
    return bcrypt.compareSync(attempt, this.password);
  };

  @BeforeInsert()
  @BeforeUpdate()
  format = () => {
    if (this.cellphone) this.cellphone = this.cellphone.replace(/[^\d]+/g, '');
  };
}
