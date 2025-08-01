export type UserRole = 'admin' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}