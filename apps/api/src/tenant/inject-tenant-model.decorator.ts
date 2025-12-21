import { Inject } from '@nestjs/common';
import { getTenantModelToken } from './tenant.tokens';

export const InjectTenantModel = (modelName: string) => Inject(getTenantModelToken(modelName));