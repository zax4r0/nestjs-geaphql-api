import { ForbiddenException, NotFoundException } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { GetArticleDto } from './dto/get-artical.dto';
// import { ArticalPoliciesGuard } from './guards/artical-policies.guard';
import { Article } from './schemas/article.schema';

@Resolver(() => Article)
export class ArticleResolver {
  constructor(
    private readonly articleService: ArticleService,
    private readonly userService: UsersService,
  ) {}
  //
  @Mutation(() => Article)
  async createArticle(
    @Args('articles') createArticleDto: CreateArticleDto,
    @CurrentUser() user: User,
  ): Promise<Article> {
    const newArticle = await this.articleService.create(
      createArticleDto,
      user._id!,
    );
    return newArticle;
  }

  @Query(() => [Article], { name: 'getArticles' })
  async getArticles(
    @Args('query') query: GetArticleDto,
  ): Promise<Article[] | null | undefined> {
    const articles = await this.articleService.findAll({
      page: query.page,
      limit: query.limit,
    });

    return articles;
  }

  @Query(() => Article, { name: 'getArticle' })
  async getArticle(
    @Args('id', { type: () => String }) _id: string,

    @CurrentUser() user: User,
  ): Promise<Article | null | undefined> {
    const article = await this.articleService.findOne(_id);

    const isAllowToRead = this.articleService.isAllowToRead(user, article!);

    if (!isAllowToRead) {
      throw new ForbiddenException();
    }

    if (!article) {
      throw new NotFoundException();
    }
    return article;
  }

  @ResolveField(() => User)
  async getArtical(
    @Parent() article: Article,
  ): Promise<User | undefined | null> {
    return await this.userService.findOneWith('_id', article.author!);
  }
}
