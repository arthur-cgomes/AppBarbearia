import { ServiceType } from '../../../common/enum/service-type.enum';
import { Services } from '../../entity/services.entity';

export const mockService = {
  name: 'name',
  type: ServiceType.HAIR,
  value: 'value',
} as Services;
