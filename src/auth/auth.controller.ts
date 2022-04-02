import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { CookieOptions, Response } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { AuthResponse, LoginDto, SignUpDto } from '../users/dto/auth.dto';
import { User } from '../users/schemas/user.schema';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('local/signup')
  async signupLocal(@Body() dto: SignUpDto): Promise<AuthResponse> {
    const user = await this.authService.signupLocal(dto);
    return user
      ? { message: 'Register Success 🥳 Please Login' }
      : { message: 'Youre email Or Password wrong 🙃' };
  }

  @Get('local/me')
  async me(@CurrentUser() user: User) {
    console.log(user);
    return user ? user : 'UNAUTHENTICATED';
  }

  @Public()
  @Post('local/signin')
  async signinLocal(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    try {
      const { token } = await this.authService.signinLocal(dto);

      const cookieOptions: CookieOptions = {
        expires: new Date(Date.now() + 900),
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        secure: false,
      };

      // res.set('Authorization', 'Bearer ' + token);
      res.cookie('Authorization', token, cookieOptions);

      return token;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  @Post('logout')
  logout(@CurrentUser() user: User): Promise<boolean> {
    return this.authService.logout(user?._id!);
  }

  @Public()
  // @UseGuards(RtGuard)
  @Post('refresh')
  refreshTokens(
    @CurrentUser('refreshToken') refreshToken: string,
    @CurrentUser()
    user: User,
  ): Promise<any> {
    return this.authService.refreshTokens(user?._id!, refreshToken);
  }
}
