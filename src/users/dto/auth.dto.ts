import { Field, HideField, InputType, ObjectType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import * as Scalars from 'graphql-scalars';
import { IsUserAlreadyExist } from '../decorators/Is-user-already-exist.decorators';
import { IsUserExist } from '../decorators/Is-user-exist.decorators';

import { Match } from '../decorators/mach.decorator';

@InputType()
@ObjectType()
export class SignUpDto {
  @Field(() => Scalars.GraphQLEmailAddress, { nullable: false })
  @IsEmail()
  @IsUserAlreadyExist()
  readonly email!: string;

  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  readonly password!: string;

  @Field(() => String, { nullable: false })
  @Match('password')
  readonly passwordConfirm?: string;
}

@InputType()
export class LoginDto {
  @Field(() => Scalars.GraphQLEmailAddress, { nullable: false })
  @IsEmail()
  @IsUserExist()
  readonly email!: string;

  @Field(() => String, { nullable: false })
  @HideField()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  readonly password!: string;
}

@ObjectType({ description: 'Login' })
export class AuthResponse {
  @Field({ nullable: true })
  token?: string;

  @Field({ nullable: true })
  message?: string;
}
