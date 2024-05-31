import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from './constants/jwt.constants';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './constants/isPublic.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const request = context.switchToHttp().getRequest();

        const roles = this.reflector.getAllAndOverride<string[]>('roles',
            [context.getHandler(), context.getClass()]);

        const token = this.extractTokenFromHeader(request);

        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);


        if (isPublic) {
            return true;
        }

        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: jwtConstants.secret
                }
            );
            request['user'] = payload;

            if (payload.roles) {
                return this.validateRoles(roles, payload.roles);
            }
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private validateRoles(roles: string[], userRoles: string[]) {
        return roles.some(role => userRoles.includes(role));
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}