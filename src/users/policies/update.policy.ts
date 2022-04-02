import { User } from '../schemas/user.schema';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { Action } from 'src/common/enums/action.enum';
import { IUserPolicyHandler } from '../interfaces/Iuser-policy-handler.interface';

export class UpdateUserPolicyHandler implements IUserPolicyHandler {
  handle(ability: AppAbility, user: User) {
    return ability.can(Action.Update, user);
  }
}
