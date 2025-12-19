import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { SuperAdminsModule } from "./core/super-admins/super-admins.module"
import { AuthModule } from "./core/auth/auth.module"
import { ClientsModule } from "./core/clients/clients.module"
import { ProjectsModule } from "./core/projects/projects.module"

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
    ClientsModule,
    ProjectsModule
  ]
})
export class AppModule {}