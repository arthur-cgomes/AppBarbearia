import { ApiProperty } from "@nestjs/swagger";
import { BaseCollection } from "src/common/entity/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class BarberShop extends BaseCollection {
    @ApiProperty()
    @Column({ length: 255})
    name: string;

    //verificar se o endereço se sequadra como texto

    @ApiProperty()
    @Column({ type: 'text', default: null })
    address: string;

    @ApiProperty()
    @Column({ type: 'number', default: null })
    phone: number;
    
}
