import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto, SignUpDto } from '@/src/users/dto/auth.dto';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signupLocal(signUpDto: SignUpDto) {
    console.log(signUpDto);
    const user = await this.userModel.findOne({ email: signUpDto.email });
    if (user) throw new ConflictException('Email Aredy Taken');
    return await this.userModel.create({ ...signUpDto });
  }

  async validateUser(email: string, pass: string): Promise<User | null> {
    console.log(email);
    const user = await this.userModel
      .findOne({ email: email })
      .select('password _id roles email active');
    const isMatch = await bcrypt.compare(pass, user?.password || '');
    if (user && isMatch) {
      return user;
    }
    return null;
  }

  async signinLocal(logindata: LoginDto): Promise<{ token: string }> {
    const user = await this.validateUser(logindata.email, logindata.password);
    if (!user) throw new ForbiddenException('Credentials incorrect');

    const payload = { email: user?.email, _id: user?._id, role: user?.roles };

    const token = await this.jwtService.sign(payload);
    return {
      token: token,
    };
  }

  async logout(userId: string): Promise<boolean> {
    await this.userModel.updateOne({ _id: userId }, [
      { $set: { 'auth.hashedRt:': { $ifNotNull: [1, 1] } } },
    ]);

    return true;
  }

  async refreshTokens(userId: string, refreshToken: string) {
    console.log(userId, refreshToken);
    return '';
  }
}
