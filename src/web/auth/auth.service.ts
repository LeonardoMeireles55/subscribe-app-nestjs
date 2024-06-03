import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import UserService from 'src/web/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { TokenCache } from 'src/util/token.cache.util';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  saltOrRounds: number = 10;
  private tokenCache = TokenCache();

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailerService
  ) { }

  async signin(email: string, pass: string): Promise<{ accessToken: string }> {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }
    const payload = { email: user.email, roles: user.role };

    const isMatch = await bcrypt.compare(pass, user?.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
  private async generateRecoveryToken(): Promise<string> {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  async recover(email: string): Promise<void> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    const recoveryToken = await this.generateRecoveryToken();
    this.tokenCache.set(email, recoveryToken);

    try {
      await this.mailService.sendMail({
        to: email,
        subject: 'Password Recovery',
        text: `Your recovery token is: ${recoveryToken}`
      });

    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
