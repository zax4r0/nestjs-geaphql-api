import { SetMetadata } from '@nestjs/common';
import { ArticalPolicyHandler } from '@/src/articles/interfaces/iArticalPolicy-handler.interface';

export const CHECK_POLICIES_KEY = 'check_policy';
export const CheckPolicies = (...handlers: ArticalPolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
