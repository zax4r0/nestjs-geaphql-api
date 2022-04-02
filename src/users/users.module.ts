import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthModule } from 'src/auth/auth.module';
import { CaslModule } from '../casl/casl.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
// import { IsUserAlreadyExistConstraint } from './decorators/Is-user-already-exist.decorators';
import { ArticleModule } from 'src/articles/article.module';
import { UsersResolver } from './users.resolver';
import { IsUserAlreadyExistConstraint } from './decorators/Is-user-already-exist.decorators';
import { IsUserExistConstraint } from './decorators/Is-user-exist.decorators';
// import { IsUserExistConstraint } from './decorators/Is-user-exist.decorators';

@Module({
  imports: [
    forwardRef(() => ArticleModule),
    forwardRef(() => AuthModule),
    forwardRef(() => CaslModule),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    UsersService,
    IsUserAlreadyExistConstraint,
    IsUserExistConstraint,
    UsersResolver,
  ],
  exports: [UsersService],
})
export class UsersModule {}
