import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuth2Client } from 'google-auth-library';
import { AccountsService } from 'src/accounts/accounts.service';
import { Account } from 'src/accounts/entities/account.entity';
import AppConfig from 'src/etc/config';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountsService: AccountsService,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly jwtService: JwtService,
  ) {}

  async getInfoFromGoogle(credential: string) {
    const client = new OAuth2Client(AppConfig.GOOGLE_CLIENT_ID);
    try {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: AppConfig.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      return [payload, null];
    } catch (err) {
      return [null, err.message];
    }
  }

  async googleLogin(credential: string) {
    // Verify credential
    const [payload, err] = await this.getInfoFromGoogle(credential);
    if (err) {
      return [null, err];
    }
    const email = payload.email;

    // Check database
    const account = await this.accountsService.getByUsername(email);
    if (!account) {
      const newAccount = new Account();
      newAccount.username = email;
      newAccount.name = `${payload.given_name} ${payload.family_name}`;
      newAccount.avatarUrl = payload.picture;
      const accountCreate = await this.accountRepository.save(newAccount);
      // create own room
      const token = this.jwtService.sign({ sub: accountCreate.id });
      return [token, null];
    }
    const token = this.jwtService.sign({ sub: account.id });
    return [token, null];
  }

  async normalLogin(username: string, password: string) {
    const account = await this.accountRepository.findOne({
      where: {
        username,
      },
    });
    if (!account || !account.checkIfUnencryptedPasswordIsValid(password))
      return [null, 'Username does not exist or password is incorrect'];
    const token = this.jwtService.sign({ sub: account.id });
    return [token, null];
  }

  async register(
    username: string,
    password: string,
    confirmPassword: string,
    name: string,
  ) {
    if (password != confirmPassword) {
      return [null, 'Confirm password does not match with password'];
    }
    const account = await this.accountsService.getByUsername(username);
    if (account) return [null, 'Username existed'];
    const accountCreate = this.accountRepository.create({
      username,
      password,
      name,
    });
    accountCreate.hashPassword();
    await this.accountRepository.save(accountCreate);
    return [accountCreate, null];
  }
}
