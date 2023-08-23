import { JwtStrategy } from './jwt.strategy';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import AppConfig from 'src/etc/config';
import { AccountsModule } from 'src/accounts/accounts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/accounts/entities/account.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: AppConfig.JWT_SECRET,
      signOptions: {
        expiresIn: AppConfig.JWT_EXPIRES_IN,
      },
    }),
    AccountsModule,
    TypeOrmModule.forFeature([Account]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [],
})
export class AuthModule {}
