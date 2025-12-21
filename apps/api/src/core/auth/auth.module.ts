import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from './constants'
import { SuperAdminsModule } from '../super-admins/super-admins.module'
import { ClientsModule } from '../clients/clients.module'
import { MailModule } from '../mail/mail.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TenantGuard } from './guards/tenant.guard';
import { SuperAdminGuard } from './guards/super-admin.guard';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7d' },
    }),
    MailModule,
    SuperAdminsModule,
    ClientsModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, TenantGuard, SuperAdminGuard],
})
export class AuthModule {}
