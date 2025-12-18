import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [
    // Core PostgreSQL
    // TypeOrmModule.forRootAsync({
    //   name: 'CORE_PG',
    //   useFactory: () => ({
    //     type: 'postgres',
    //     host: process.env.CORE_PG_HOST,
    //     port: +process.env.CORE_PG_PORT,
    //     username: process.env.CORE_PG_USER,
    //     password: process.env.CORE_PG_PASS,
    //     database: process.env.CORE_PG_DB,
    //     autoLoadEntities: true,
    //     synchronize: false,
    //   }),
    // }),

    // Core MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}

// TypeOrmModule.forFeature([UserEntity], 'CORE_PG');
// MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }], 'CORE_MONGO');
