import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from './core/database/core-database.module';
import { ProjectModule } from './feature/project/project.module';
import { UserModule } from './feature/user/user.module';
import { TenantModule } from './common/tenant/tenant.module'
import { AuthModule } from './feature/auth/auth.module'
import { MailModule } from './feature/mail/mail.module'
import { FileModule } from './feature/file/file.module'
import { PageModule } from './feature/page/page.module'
import { SectionModule } from './feature/section/section.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ProjectModule,
    TenantModule,
    UserModule,
    AuthModule,
    MailModule,
    FileModule,
    PageModule,
    SectionModule,
  ]
})
export class AppModule {}
