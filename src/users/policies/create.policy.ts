import { AppAbility } from 'src/casl/casl-ability.factory';
import { Action } from 'src/common/enums/action.enum';
import { IArticalPolicyHandler } from '@/src/articles/interfaces/iArticalPolicy-handler.interface';
import { User } from '../schemas/user.schema';

export class CreateUserPolicyHandler implements IArticalPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Create, User);
  }
}
