import { Field, InputType } from '@nestjs/graphql';

@InputType('getArticals', { description: 'get all articals', isAbstract: true })
export class GetArticleDto {
  @Field(() => Number, { nullable: true })
  readonly page?: number;

  @Field(() => Number, { nullable: true })
  readonly limit?: number;
}
