import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DatabaseModule } from './core/database/core-database.module';
import { ProjectModule } from './feature/project/project.module';
import { UserModule } from './feature/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './feature/user/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
  MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const uri = config.get<string>("MONGO_URI", { infer: true });
        return {
          uri,
          serverSelectionTimeoutMS: 5000,
        };
      },
    }),
    DatabaseModule,
    UserModule,
    ProjectModule,
  ]
})
export class AppModule {}
