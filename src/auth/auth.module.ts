import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { jwtConstants } from '../common/contants/constant';
import { JwtStragety } from './strategies/jwt.strategy';
import { Local1Stragety } from './strategies/local.strategy';
import { AuthResolver } from './auth.resolver';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { HttpModule } from '@nestjs/axios';
@Module({
  providers: [AuthService, Local1Stragety, JwtStragety, AuthResolver],
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3600s' },
    }),
    forwardRef(() => UsersModule),
    HttpModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
