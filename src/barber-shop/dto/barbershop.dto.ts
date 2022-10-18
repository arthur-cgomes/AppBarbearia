import { OmitType } from "@nestjs/swagger";
import { BarberShop } from "../entity/barber-shop.entity";

export class BarberShopDto extends OmitType(BarberShop, []) {}       // quando fizer o relacionamento, adicionar em chaves [] a entidade relacionada para o retorno da rota