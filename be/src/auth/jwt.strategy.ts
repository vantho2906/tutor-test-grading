import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccountsService } from '../accounts/accounts.service';
import AppConfig from '../etc/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly accountsService: AccountsService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: AppConfig.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const accountId = payload.sub;
    const account = await this.accountsService.getByID(accountId);
    if (!account) {
      return null;
    }
    return account;
  }
}
