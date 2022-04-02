import { IS_PUBLIC_KEY } from '@/src/common/decorators/public.decorator';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GobalJwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(ctx: ExecutionContext) {
    // For reest methods
    if (ctx.getType() === 'http') {
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [ctx.getHandler(), ctx.getClass()],
      );

      // if @Public metadata is set then allow
      if (isPublic) {
        return true;
      }
      const req = ctx.switchToHttp().getRequest();
      return super.canActivate(new ExecutionContextHost([req]));
    }
    // For graphql
    const context = GqlExecutionContext.create(ctx);
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // if @Public metadata is set then allow
    if (isPublic) {
      return true;
    }

    const { req } = context.getContext();

    return super.canActivate(new ExecutionContextHost([req])); // NOTE
  }
}
