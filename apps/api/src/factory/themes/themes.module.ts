import { Module } from '@nestjs/common';
import { ThemesService } from './themes.service';
import { ThemesController } from './themes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SuperAdminsModule } from 'src/core/super-admins/super-admins.module';
import { Theme, ThemeSchema } from './entities/theme.entity';

@Module({
  imports: [
        MongooseModule.forFeature(
          [{ name: Theme.name, schema: ThemeSchema }],
          'core',
        ),
        SuperAdminsModule,
      ],
  controllers: [ThemesController],
  providers: [ThemesService],
})
export class ThemesModule {}
