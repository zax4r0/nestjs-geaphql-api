import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateArticleDto {
  @Field(() => String, { nullable: false })
  @MinLength(1)
  @MaxLength(500)
  title?: string;

  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  content?: string;

  @Field(() => String, { nullable: true })
  description?: string;
}
