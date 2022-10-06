import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";
import { BaseCollection } from "src/common/entity/base.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, Unique } from "typeorm";

@Entity()
@Unique(['email'])
export class User extends BaseCollection {
    @ApiProperty()
    @Column()
    @IsEmail()
    email: string;

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

    @BeforeInsert()
    @BeforeUpdate()
    format = () => {
        if (this.phone) this.phone = this.phone.replace(/[^\d]+/g, '');
    }
}