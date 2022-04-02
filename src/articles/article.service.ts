/* eslint-disable @typescript-eslint/ban-types */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Article } from '@/src/articles/schemas/article.schema';
import { CreateArticleDto } from 'src/articles/dto/create-article.dto';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Action } from 'src/common/enums/action.enum';
import { User } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name)
    private articleModel: Model<Article>,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  // private customLabels = {
  //   docs: 'nodes',
  //   page: 'currentPage',
  //   totalPages: 'pageCount',
  //   limit: 'perPage',
  //   totalDocs: 'itemCount',
  // };

  async create(
    createArticleDto: CreateArticleDto,
    userId: string,
  ): Promise<Article> {
    //
    // createArticleDto.author = userId;
    const createdArticle = new this.articleModel({
      ...createArticleDto,
      author: userId,
    });

    return await createdArticle.save();
  }

  async update(
    _id: string,
    createArticleDto: CreateArticleDto,
  ): Promise<Article | null | undefined> {
    const article = await this.articleModel.findByIdAndUpdate(
      _id,
      createArticleDto,
    );

    return await this.articleModel.findById(article?._id);
  }

  async delete(id: string): Promise<Article | null | undefined> {
    return this.articleModel.findByIdAndDelete(id);
  }

  async findOne(_id: string): Promise<Article | null | undefined> {
    const article = await this.articleModel.findById(_id).lean();
    return article;
  }

  async findAll({
    page = 1,
    limit = 10,
  }: {
    page?: number;
    limit?: number;
  }): Promise<Article[] | null | undefined> {
    console.log(page, limit);
    return this.articleModel.find({ isPublished: true });
  }

  isAllowToRead(user: User, article: Article): Boolean {
    const ability = this.caslAbilityFactory.createForUser(user);

    const articleCheck = new Article();

    articleCheck.isPublished = article.isPublished;

    articleCheck.status = article.status;
    if (user) {
      articleCheck.author =
        article?.author!.toString() || article.author!.toString();
    }
    if (!ability.can(Action.Read, articleCheck)) {
      return false;
    }

    return true;
  }
}
