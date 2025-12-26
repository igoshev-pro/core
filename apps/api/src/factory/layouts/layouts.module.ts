import { Module } from '@nestjs/common';
import { LayoutsService } from './layouts.service';
import { LayoutsController } from './layouts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Layout, LayoutSchema } from './entities/layout.entity';
import { SuperAdminsModule } from 'src/core/super-admins/super-admins.module';

@Module({
  imports: [
      MongooseModule.forFeature(
        [{ name: Layout.name, schema: LayoutSchema }],
        'core',
      ),
      SuperAdminsModule,
    ],
  controllers: [LayoutsController],
  providers: [LayoutsService],
})
export class LayoutsModule {}