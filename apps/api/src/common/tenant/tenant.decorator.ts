import { createParamDecorator, ExecutionContext, Inject } from '@nestjs/common';

export const Tenant = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.tenant;
  },
);

export const InjectTenantPgRepository = (entity: any) =>
  Inject(`${entity.name}TenantRepository`);

export const InjectTenantMongoCollection = (name: string) =>
  Inject(`${name}TenantCollection`);

// @Get('contacts')
// getContacts(@Tenant() tenant: TenantConfig) {
//   return `Проект: ${tenant.name}`;
// }

// constructor(
//     @InjectTenantPgRepository(UserEntity)
//     private readonly userRepo: Repository<UserEntity>,

//     @InjectTenantMongoCollection('pages')
//     private readonly pagesCollection: Collection<PageDocument>,
//   ) {}
