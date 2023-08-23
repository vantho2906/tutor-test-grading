import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';
import CurrentAccount from 'src/decorators/current-account.decorator';
import { Account } from 'src/accounts/entities/account.entity';
import { AuthService } from './auth.service';
import ResponseObject from 'src/etc/response-object';
import { NormalLoginDto } from './dtos/normal-login.dto';
import { RegisterDto } from './dtos/resgister.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('self')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async self(@CurrentAccount() account: Account) {
    return account;
  }

  @Get('get-info-from-google/:credential')
  @ApiParam({ name: 'credential' })
  async getInfoFromGoogle(@Param('credential') credential: string) {
    const [info, err] = await this.authService.getInfoFromGoogle(credential);
    return new ResponseObject(
      HttpStatus.OK,
      'Get info from google success',
      info,
      null,
    );
  }

  @Post('google-login/:credential')
  @ApiParam({ name: 'credential' })
  async googleLogin(@Param('credential') credential: string) {
    const [account, err] = await this.authService.googleLogin(credential);
    if (err) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Login failed',
        null,
        err,
      );
    }
    return new ResponseObject(HttpStatus.OK, 'Login success', account, null);
  }

  @Post('normal-login')
  @ApiBody({ type: NormalLoginDto, required: true })
  async normalLogin(@Body() info: NormalLoginDto) {
    const { username, password } = info;
    const [account, err] = await this.authService.normalLogin(
      username,
      password,
    );
    if (err) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Login failed',
        null,
        err,
      );
    }
    return new ResponseObject(HttpStatus.OK, 'Login success', account, null);
  }

  @Post('register')
  @ApiBody({ type: RegisterDto, required: true })
  async register(@Body() info: RegisterDto) {
    const { username, password, name, confirmPassword } = info;
    const [account, err] = await this.authService.register(
      username,
      password,
      confirmPassword,
      name,
    );
    if (err) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Register failed',
        null,
        err,
      );
    }
    return new ResponseObject(HttpStatus.OK, 'Register success', account, null);
  }
}
