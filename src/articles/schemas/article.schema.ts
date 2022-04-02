import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Status } from 'src/common/enums/status.enum';
import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';

export type ArticleDocument = Article & Document;

@InputType('articalReally', { isAbstract: true })
@ObjectType({ description: 'articalReally', isAbstract: true })
@Schema({ timestamps: true })
export class Article {
  @Field(() => ID, { nullable: true })
  _id?: string;

  @Field(() => String, { nullable: false })
  @Prop({ required: true })
  title?: string;

  @Field(() => String, { nullable: true })
  @Prop()
  description?: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author?: string;

  @Field(() => Boolean, { nullable: true })
  @Prop({ default: false })
  isPublished?: boolean;

  @Field(() => Number, { nullable: true })
  @Prop({ default: Status.Pending })
  status?: number;

  @Field(() => String, { nullable: true })
  @Prop({ required: true })
  content?: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);

ArticleSchema.index({ author: 1 });

// ArticleSchema.plugin(mongoosePaginate);

@InputType()
export class FindArticleInput {
  @Field()
  _id?: string;
}
