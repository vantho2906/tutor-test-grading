import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from './accounts/accounts.module';
import AppDataSource from './database/datasource';
import { AuthModule } from './auth/auth.module';
import { GoogleApiModule } from './google-api/google-api.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    AccountsModule,
    AuthModule,
    GoogleApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
