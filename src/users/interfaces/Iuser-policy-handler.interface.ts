import { AppAbility } from 'src/casl/casl-ability.factory';
import { User } from '../schemas/user.schema';

export interface IUserPolicyHandler {
  handle(ability: AppAbility, user: User): boolean;
}

type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export type UserPolicyHandler = IUserPolicyHandler | PolicyHandlerCallback;
