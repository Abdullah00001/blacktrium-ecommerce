import { JwtPayload } from 'jsonwebtoken';
import { Socket } from 'socket.io';

import { IUser, Role } from '@/app/models/user.model';

export interface ITokenPayload extends JwtPayload {
  sub: string;
  rememberMe?: boolean;
  role: Role;
  isVerified: boolean;
  accountStatus: string;
}

export interface AuthenticatedSocket extends Socket {
  user?: IUser;
  traceId?: string;
}
