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

export interface IUserWithCargoId extends IUserWithId {
  cargo: string;
  status: string;
}

export interface IAuthUser {
  uid?: string;
  email: string;
}

export interface ILog {
  asctime: string;
  levelname: string;
  message: string;
}

export interface IStatusApi {
  filaCargos: string[];
  driverAtivo: boolean;
  inscricoesRodando: string[];
  inscricoesPendentes: number;
}
