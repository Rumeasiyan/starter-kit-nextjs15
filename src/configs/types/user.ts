import { User } from 'better-auth';

export type UserType = User & {
  roles?: string[];
};
