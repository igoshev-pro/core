import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { SuperAdminsModule } from "./core/super-admins/super-admins.module"
import { AuthModule } from "./core/auth/auth.module"
import { ClientsModule } from "./core/clients/clients.module"
import { ProjectsModule } from "./core/projects/projects.module"
import { MailModule } from "./core/mail/mail.module"
import { TenantMiddleware } from "./tenant/tenant.middleware"
import { UsersModule } from './feature/users/users.module';
import { StorageModule } from './core/storage/storage.module';
import { RedisModule } from './redis/redis.module';
import { DomainsModule } from './core/domains/domains.module';
import { FactoryModule } from './factory/factory.module';
import { RequestsModule } from './feature/requests/requests.module';
import { ProductsModule } from './feature/products/products.module';
import { CasesModule } from './feature/cases/cases.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      connectionName: 'core',
      useFactory: (config: ConfigService) => ({
        uri: config.get('MONGO_URI'),
        dbName: 'core'
      }),
      inject: [ConfigService],
    }),
    RedisModule,
    DomainsModule,
    SuperAdminsModule,
    AuthModule,
    MailModule,
    ClientsModule,
    ProjectsModule,
    UsersModule,
    StorageModule,
    RedisModule,
    DomainsModule,
    FactoryModule,
    RequestsModule,
    ProductsModule,
    CasesModule
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).exclude(
      { path: 'core/(.*)', method: RequestMethod.ALL },
    )
      .forRoutes({ path: '(.*)', method: RequestMethod.ALL });
  }
}