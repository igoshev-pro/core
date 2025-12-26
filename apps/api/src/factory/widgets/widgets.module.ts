import { Module } from '@nestjs/common';
import { WidgetsService } from './widgets.service';
import { WidgetsController } from './widgets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SuperAdminsModule } from 'src/core/super-admins/super-admins.module';
import { Widget, WidgetSchema } from './entities/widget.entity';

@Module({
  imports: [
        MongooseModule.forFeature(
          [{ name: Widget.name, schema: WidgetSchema }],
          'core',
        ),
        SuperAdminsModule,
      ],
  controllers: [WidgetsController],
  providers: [WidgetsService],
})
export class WidgetsModule {}
