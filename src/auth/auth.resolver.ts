import { UnauthorizedException } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CookieOptions } from 'express';
import { Public } from '../common/decorators/public.decorator';
import Ctx from '../types/context.type';
import { AuthResponse, SignUpDto, LoginDto } from '../users/dto/auth.dto';
import { User } from '../users/schemas/user.schema';
import { AuthService } from './auth.service';

@Resolver(() => User)
export class AuthResolver {
  constructor(
    private authService: AuthService, // 👈
  ) {}

  @Public()
  @Mutation(() => AuthResponse)
  async registerUser(
    @Args('register') registerUserInput: SignUpDto,
    // @Context() context: Ctx,
  ): Promise<AuthResponse> {
    // if (context?.req?.user) {
    //   throw new UnauthorizedException('Logout Before Registering');
    // }
    const user = await this.authService.signupLocal(registerUserInput);

    return user
      ? { message: 'Register Success 🥳 Please Login' }
      : { message: 'Youre email Or Password wrong 🙃' };
  }

  /*
   *  Login As Query , This update the Applo cache xd
   */

  @Public()
  @Query(() => AuthResponse)
  async login(
    @Args('login') loginUserInput: LoginDto,
    @Context() context: Ctx,
  ): Promise<{ message: string }> {
    // if (context.req.cookies['Authorization']) {
    //   throw new UnauthorizedException(
    //     'Alredy logged in Logout Before Logging In Again',
    //   );
    // }
    const { token } = await this.authService.signinLocal(loginUserInput);

    const cookieOptions: CookieOptions = {
      expires: new Date(Date.now() + 900),
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
      sameSite: 'none',
      secure: true,
    };

    context.res.cookie('Authorization', token, cookieOptions);

    return token
      ? { message: 'Login Success 🥳 ' }
      : { message: 'Youre email Or Password wrong 🙃' };
  }

  @Query(() => AuthResponse)
  async logout(
    // @Args('loout') logout:null,
    @Context()
    context: Ctx,
  ): Promise<{ message: string }> {
    if (!context?.req?.cookies['Authorization']) {
      throw new UnauthorizedException('Alredy Logout Logged out');
    }

    const cookieOptions: CookieOptions = {
      expires: new Date(Date.now() + 900),
      httpOnly: true,
      maxAge: 0,
      sameSite: 'none',
      secure: true,
    };

    context.res.cookie('Authorization', '', cookieOptions);

    return { message: 'Loged Success 🥳 ' };
  }

  // @Query(() => User, { name: 'me' })
  // async me(@CurrentUser() user: User): Promise<User | undefined | null> {
  //   return await this.authService.findOne(user.email!);
  // }
}
