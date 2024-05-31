import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Repository } from "typeorm";
import { UnauthorizedException } from "@nestjs/common";
import { UserEntity } from "src/entities/user.entity";
import { jwtConstants } from "../constants/jwt.constants";

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) {
        super({
            secretOrKey: jwtConstants.secret,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(payload: any): Promise<UserEntity> {
        const { email } = payload;
        const user: UserEntity = await this.userRepository
            .findOne({ select: ["id", "email", "password", "role"], where: { email } });

        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}