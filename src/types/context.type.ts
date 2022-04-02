import { Request, Response } from 'express';
import { User } from '../users/schemas/user.schema';

type Ctx = {
  req: Request & { user?: Pick<User, 'email'> };
  res: Response;
};

export default Ctx;
