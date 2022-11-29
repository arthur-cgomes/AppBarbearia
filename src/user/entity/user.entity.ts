import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { BaseCollection } from '../../common/entity/base.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserType } from '../../user-type/entity/user-type.entity';
import { Notification } from '../../notification/entity/notification.entity';
import { UserNotification } from '../../user-notification/entity/user-notification.entity';
import { Service } from '../../services/entity/services.entity';
import { BarberShop } from '../../barber-shop/entity/barber-shop.entity';
import { Scheduling } from '../../scheduling/entity/scheduling.entity';

@Entity()
@Unique(['email'])
export class User extends BaseCollection {
  @ApiProperty()
  @Column()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Column({ default: null, select: false })
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @Column({ length: 150 })
  name: string;

  @ApiProperty()
  @Column({ type: 'timestamp', default: null })
  birthDate: Date;

  @ApiProperty()
  @Column({ length: 20, default: null })
  phone: string;

  @ApiProperty({ type: () => UserType })
  @ManyToMany(() => UserType, (usertype) => usertype.users)
  @JoinTable({ name: 'user_user_type' })
  userTypes: UserType[];

  @ApiProperty({ type: () => Notification })
  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @ApiProperty({ type: () => UserNotification })
  @OneToMany(
    () => UserNotification,
    (usernotification) => usernotification.user,
  )
  usernotifications: UserNotification[];

  @ApiProperty({ type: () => BarberShop })
  @OneToMany(() => BarberShop, (barbershop) => barbershop.user)
  barbershops: BarberShop[];

  @ApiProperty({ type: () => Service })
  @ManyToMany(() => Service, (service) => service.users)
  @JoinTable({ name: 'user_services' })
  services: Service[];

  @ApiProperty({ type: () => Scheduling })
  @OneToMany(() => Scheduling, (scheduling) => scheduling.users)
  schedulings: Scheduling[];

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    if (
      this.password &&
      this.password !== undefined &&
      this.password !== null
    ) {
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
    if (this.phone) this.phone = this.phone.replace(/[^\d]+/g, '');
  };
}
