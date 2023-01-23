import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";
import { BaseCollection } from "src/common/entity/base.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, Unique } from "typeorm";

@Entity()
export class Barber extends BaseCollection {
    @ApiProperty()
    @IsNotEmpty()
    @Column({ length: 20, default: null })
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

    @BeforeInsert()
    @BeforeUpdate()
    format = () => {
        if (this.phone) this.phone = this.phone.replace(/[^\d]+/g, '');
    };
}