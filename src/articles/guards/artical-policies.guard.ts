import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ArticleService } from 'src/articles/article.service';
import { AppAbility, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { ArticalPolicyHandler } from '@/src/articles/interfaces/iArticalPolicy-handler.interface';
import { Article } from '@/src/articles/schemas/article.schema';
import { CHECK_POLICIES_KEY } from '../../common/decorators/check-policies.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '@/src/users/schemas/user.schema';

@Injectable()
export class ArticalPoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
    private articleService: ArticleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<ArticalPolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    // const { user, params } = context.switchToHttp().getRequest();
    // const { id } = params;

    const ctx = GqlExecutionContext.create(context);

    const { user }: { user: User } = ctx.getContext().req;

    const ability = this.caslAbilityFactory.createForUser(user);

    const article = await this.articleService.findOne(user._id!);
    const articleCheck = new Article();
    articleCheck.isPublished = article?.isPublished!;
    articleCheck.status = article?.status!;

    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      articleCheck.author = article?.author || article!.author!.toString();
    }
    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability, articleCheck),
    );
  }

  private execPolicyHandler(
    handler: ArticalPolicyHandler,
    ability: AppAbility,
    article: Article,
  ) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability, article);
  }
}
