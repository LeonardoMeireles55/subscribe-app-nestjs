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
}
