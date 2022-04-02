import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Schema, Prop } from '@nestjs/mongoose';
import { Address } from './adress.schema';

@InputType('userProfile', { isAbstract: true })
@ObjectType({ description: 'userProfile', isAbstract: true })
@Schema({ timestamps: true })

//
export class Profile {
  @Field(() => String, { nullable: false })
  @Prop({ required: false })
  avatar?: string;

  @Field(() => String, { nullable: false })
  @Prop({ required: false })
  phone?: string;

  @Field(() => String, { nullable: false })
  @Prop({ required: false })
  address?: [Address];
}
