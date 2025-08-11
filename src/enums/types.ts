export interface IUser {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  genero: string;
}

export interface IUserWithId extends IUser {
  id: number;
}

export interface IUserWithCargos extends IUser {
  cargos: string[];
  status: string;
}

export interface IUserWithCargo extends IUser {
  cargo: string;
  status: string;
}

export interface IAuthUser {
  uid?: string;
  email: string;
}
