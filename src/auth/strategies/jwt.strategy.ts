import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { jwtConstants } from '../../common/contants/constant';
import { Request } from 'express';
import { User } from '@/src/users/schemas/user.schema';

@Injectable()
export class JwtStragety extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: (req: Request) => {
        if (!req || !req.cookies) {
          const x = ExtractJwt.fromAuthHeaderAsBearerToken();
          if (!x) return null;
          return x;
        }
        return req.cookies['Authorization'];
      },
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(validationPayload: {
    email: string;
    sub: string;
    _id: string;
    role: string;
  }): Promise<User | undefined | null> {
    return this.usersService.findOne(validationPayload.email);
  }
}
