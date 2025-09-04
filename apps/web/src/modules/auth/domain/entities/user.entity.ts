import { Role } from "./role.enum";

export interface UserAuth {
  email: string;
  token: string;
  role: Role;
}

export class UserAuthEntity implements UserAuth {
  email: string;
  token: string;
  role: Role;

  constructor(userAuth: UserAuth) {
    this.email = userAuth.email;
    this.token = userAuth.token;
    this.role = userAuth.role;
  }
}
