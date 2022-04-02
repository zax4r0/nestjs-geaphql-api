import { Schema, Prop } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Auth {
  @Prop()
  hashedRt?: string;
}
