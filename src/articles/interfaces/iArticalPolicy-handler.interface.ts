import { AppAbility } from 'src/casl/casl-ability.factory';
import { Article } from '@/src/articles/schemas/article.schema';

export interface IArticalPolicyHandler {
  handle(ability: AppAbility, article: Article): boolean;
}

type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export type ArticalPolicyHandler =
  | IArticalPolicyHandler
  | PolicyHandlerCallback;
