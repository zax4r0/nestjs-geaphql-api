import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/*
 *Setting name to Xcontext  Just to Diffrentiate
 *{Context } From @nestjs/graphql
 * @Context
 */

export const Context = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    if (context.getType() === 'http') {
      const ctx = context.switchToHttp();
      return ctx;
    }

    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext();
  },
);
