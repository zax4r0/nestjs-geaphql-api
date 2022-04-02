import { CHECK_POLICIES_KEY } from '@/src/common/decorators/check-policies.decorator';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AppAbility, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { UserPolicyHandler } from '../interfaces/Iuser-policy-handler.interface';
import { User } from '../schemas/user.schema';
import { UsersService } from '../users.service';

@Injectable()
export class UserPoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<UserPolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    // const { user, params } = context.switchToHttp().getRequest();

    const ctx = GqlExecutionContext.create(context);

    const { user }: { user: User } = ctx.getContext().req;

    const ability = this.caslAbilityFactory.createForUser(user);
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    const userFromDb = await this.userService.findOne(user._id!);

    const userCheck = new User();

    // userCheck.is_active = userFromDb.is_active;
    // userCheck.status = article.status;

    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      userCheck.email = userFromDb?.email!;
    }
    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability, userCheck),
    );
  }

  private execPolicyHandler(
    handler: UserPolicyHandler,
    ability: AppAbility,
    user: User,
  ) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability, user);
  }
}
