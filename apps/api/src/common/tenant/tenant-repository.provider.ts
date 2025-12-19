// tenant-repository.provider.ts
import { Provider } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TenantDatabaseService } from './tenant-database.service';

export function createTenantPgRepositoryProvider<T>(
  entity: new () => T,
): Provider {
  return {
    provide: `${entity.name}TenantRepository`,
    useFactory: async (
      tenantDb: TenantDatabaseService,
    ): Promise<Repository<T>> => {
      const pg = await tenantDb.getPostgresConnection();
      if (!pg) throw new Error(`Нет подключения к Postgres для tenant`);
      return pg.getRepository(entity);
    },
    inject: [TenantDatabaseService],
  };
}

// @Module({
//   providers: [
//     UserService,
//     createTenantPgRepositoryProvider(UserEntity),
//     createTenantMongoCollectionProvider<PageDocument>('pages'),
//   ],
//   exports: [UserService],
// })
// export class UserModule {}
