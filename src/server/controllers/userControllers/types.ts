export interface Credentials {
  username: string;
  password: string;
}

export interface RegisterData extends Credentials {
  email: string;
}
