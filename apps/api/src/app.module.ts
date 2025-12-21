import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { SuperAdminsModule } from "./core/super-admins/super-admins.module"
import { AuthModule } from "./core/auth/auth.module"
import { ClientsModule } from "./core/clients/clients.module"
import { ProjectsModule } from "./core/projects/projects.module"
import { MailModule } from "./core/mail/mail.module"
import { TenantDatabaseModule } from "./tenant/tenant-database.module"
import { TenantMiddleware } from "./tenant/tenant.middleware"
import { UsersModule } from './feature/users/users.module';

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
    SuperAdminsModule,
    AuthModule,
    MailModule,
    ClientsModule,
    ProjectsModule,
    TenantDatabaseModule.forRoot(),
    UsersModule
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*'); // или только tenant-роуты
  }
}