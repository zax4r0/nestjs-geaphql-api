import { AppAbility } from 'src/casl/casl-ability.factory';
import { Action } from 'src/common/enums/action.enum';
import { IArticalPolicyHandler } from '@/src/articles/interfaces/iArticalPolicy-handler.interface';
import { Article } from '@/src/articles/schemas/article.schema';

export class DeleteArticlePolicyHandler implements IArticalPolicyHandler {
  handle(ability: AppAbility, article: Article) {
    return ability.can(Action.Delete, article);
  }
}
