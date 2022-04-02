import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userData: User): Promise<User> {
    const isuser = await this.userModel.findOne({ email: userData.email });
    if (isuser) {
      throw new ConflictException('User Exist');
    }
    const createdUser = new this.userModel({ ...userData });
    const user = await createdUser.save();
    return user;
  }

  async findOne(email: string): Promise<User | undefined | null> {
    const user = await this.userModel.findOne({ email: email });
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOneWith(
    query: string,
    value: string,
  ): Promise<User | undefined | null> {
    const user = await this.userModel.findOne({ [query]: [value] });
    return user;
  }
}
