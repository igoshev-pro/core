import { Module } from '@nestjs/common';
import { TemplatesModule } from './templates/templates.module';
import { ThemesModule } from './themes/themes.module';
import { LayoutsModule } from './layouts/layouts.module';
import { PagesModule } from './pages/pages.module';
import { SectionsModule } from './sections/sections.module';
import { WidgetsModule } from './widgets/widgets.module';

@Module({
  imports: [TemplatesModule, ThemesModule, LayoutsModule, PagesModule, SectionsModule, WidgetsModule]
})
export class FactoryModule {}
