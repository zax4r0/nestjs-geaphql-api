import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Schema, Prop } from '@nestjs/mongoose';

@InputType('userAdress', { isAbstract: true })
@ObjectType({ description: 'userAdress', isAbstract: true })
@Schema({ timestamps: true })

//
export class Address {
  @Field(() => String, { nullable: false })
  @Prop({ required: false })
  city?: string;

  @Field(() => String, { nullable: false })
  @Prop({ required: false })
  district?: string;

  @Field(() => String, { nullable: false })
  @Prop({ required: false })
  ward?: string;

  @Field(() => String, { nullable: false })
  @Prop({ required: false })
  street?: string;

  @Field(() => String, { nullable: false })
  @Prop({ required: false })
  number?: string;
}
