import { AppAbility } from 'src/casl/casl-ability.factory';
import { Action } from 'src/common/enums/action.enum';
import { IArticalPolicyHandler } from '@/src/articles/interfaces/iArticalPolicy-handler.interface';
import { Article } from '../schemas/article.schema';

export class UpdateArticlePolicyHandler implements IArticalPolicyHandler {
  // private aricleService: ArticleService;
  handle(ability: AppAbility, article: Article) {
    return ability.can(Action.Update, article);
  }
}
