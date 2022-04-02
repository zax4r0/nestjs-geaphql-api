import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { CaslModule } from 'src/casl/casl.module';
import { Article, ArticleSchema } from '@/src/articles/schemas/article.schema';
import { ArticleService } from './article.service';
import { ArticleResolver } from './article.resolver';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => CaslModule),
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
  ],
  providers: [ArticleService, ArticleResolver],
  // controllers: [ArticleController],
  exports: [ArticleService],
})
export class ArticleModule {}
