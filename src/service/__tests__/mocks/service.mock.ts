import { ServiceType } from '../../../common/enum/service-type.enum';
import { Service } from '../../entity/service.entity';

export const mockService = {
  name: 'name',
  type: ServiceType.HAIR,
  value: 'value',
} as Service;
