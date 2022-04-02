import { User } from 'src/users/schemas/user.schema';
import { UsersService } from './users.service';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CheckPolicies } from '../common/decorators/check-policies.decorator';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ReadUserPolicyHandler } from './policies/read.policy';
import { UserPoliciesGuard } from './guards/user-policies.guard';
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Query(() => User, { name: 'me' })
  async me(@CurrentUser() user: User): Promise<User | undefined | null> {
    return await this.userService.findOne(user.email!);
  }

  @UseGuards(UserPoliciesGuard)
  @CheckPolicies(new ReadUserPolicyHandler())
  @Query(() => User, { name: 'user' })
  async findOne(
    @Args('emial', { type: () => String }) email: string,
  ): Promise<User | undefined | null> {
    return await this.userService.findOne(email);
  }

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: User,
    // @Context() context: Ctx,
  ): Promise<User> {
    const user = await this.userService.create(createUserInput);

    return user;
  }
}
