import {
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseCollection extends BaseEntity {
  @ApiProperty({
    description: 'Id uuid padrão',
    type: String,
  })
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ApiProperty({
    description: 'Data de criação do registro',
    type: Date,
  })
  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Data de edição do registro',
    type: Date,
  })
  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: string;

  @ApiProperty({
    description: 'Registro ativo ou não',
    type: Boolean,
  })
  @Column({ type: 'bool', default: true })
  active: boolean;
}
