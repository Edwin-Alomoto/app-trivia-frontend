export type Role = 'ADMIN' | 'USER' | string;

export interface UserDto {
  id: string;
  username: string;
  email: string;
  role: Role;
}


