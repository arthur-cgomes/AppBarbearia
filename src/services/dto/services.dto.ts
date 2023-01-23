import { OmitType } from '@nestjs/swagger';
import { Service } from '../entity/services.entity';

export class ServicesDto extends OmitType(Service, ['users']) {}
