import { Injectable, UnauthorizedException } from '@nestjs/common';
import UserService from 'src/web/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  saltOrRounds: number = 10;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signin(email: string, pass: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(pass, user?.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
