import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Roles } from 'src/common/enums/roles.enum';
import * as bcrypt from 'bcrypt';
import { Field, HideField, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Article } from '@/src/articles/schemas/article.schema';
import mongoose from 'mongoose';
import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsEmail,
} from 'class-validator';
import { Match } from '../decorators/mach.decorator';
import * as Scalars from 'graphql-scalars';
import { Profile } from './profile.schema';
import { Auth } from './auth.schema';
/*
 * Easy to read
 */

export type UserDocument = User & Document;

@InputType('CreateUser', { isAbstract: true })
@ObjectType({ description: 'GetUser', isAbstract: true })
@Schema({ timestamps: true })
export class User {
  @Field(() => ID, { nullable: true })
  _id?: string;

  @Field(() => Scalars.GraphQLEmailAddress, { nullable: false })
  @IsEmail()
  @Prop({ required: true })
  email?: string;

  @Field(() => String, { nullable: true })
  @Prop()
  name?: string;

  @Field(() => String, { nullable: true })
  @HideField()
  @Prop({ select: false })
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password?: string;

  /*
   * User Shema / model is  usered to
   * create new user @InputType need password matching
   * Not storing in Db
   */

  @Field(() => String, { nullable: true })
  @Match('password')
  readonly passwordConfirm?: string;

  @Field(() => Boolean, { nullable: true })
  @Prop({ required: true, default: false })
  active?: boolean;

  @Field(() => [String], { nullable: true })
  @Prop({ required: true, default: [Roles.Member] })
  roles?: Array<string>;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Auth' }] })
  auth?: Auth;

  @Field(() => Profile, { nullable: true })
  @Prop({ required: false })
  profile?: Profile;

  @Field(() => [Article], { nullable: true })
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }] })
  articles?: Article[];
}

export const UserSchema = SchemaFactory.createForClass(User);

//
UserSchema.pre<User>('save', async function (next) {
  if (this.password) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  }
});
