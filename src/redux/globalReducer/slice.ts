import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IAuthUser, ILog, IStatusApi, IUserWithCargoId, IUserWithId } from "../../enums/types";

interface initialStateType {
  user: IAuthUser | null;
  users: IUserWithId[];
  usersInscricoes: IUserWithCargoId[];

  inscricoesErro: string[];
  inscricoesPendentes: string[];
  inscricoesConcluidas: string[];

  logs: ILog[];
  linkApi: string;
  statusApi: IStatusApi | null;
}

const initialState: initialStateType = {
  user: null,
  users: [
    {
      id: 12,
      nome: "Victor Guilherme Pereira da Silva",
      cpf: "11946397474",
      telefone: "81988160687",
      email: "victorguilherme20041@gmail.com",
      genero: "homem",
    },
    {
      id: 13,
      nome: "Clay",
      cpf: "11946397474",
      telefone: "81988160687",
      email: "victorguilherme20041@gmail.com",
      genero: "homem",
    },
  ],

  usersInscricoes: [],
  inscricoesErro: [],
  inscricoesPendentes: [],
  inscricoesConcluidas: [],

  logs: [],
  linkApi: "https://unified-muskrat-known.ngrok-free.app",

  statusApi: null,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IAuthUser | null>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    setUsers: (state, action: PayloadAction<IUserWithId[]>) => {
      state.users = Array.isArray(action.payload) ? action.payload : [];
    },
    setLinkApi: (state, action: PayloadAction<string>) => {
      state.linkApi = action.payload;
    },
    setUsersInscricoes: (state, action: PayloadAction<IUserWithCargoId[]>) => {
      state.usersInscricoes = action.payload;
    },
    setInscricoesPendentes: (state, action: PayloadAction<string[]>) => {
      state.inscricoesPendentes = action.payload;
    },
    setInscricoesErro: (state, action: PayloadAction<string[]>) => {
      state.inscricoesErro = action.payload;
    },
    setInscricoesConcluidas: (state, action: PayloadAction<string[]>) => {
      state.inscricoesConcluidas = action.payload;
    },
    setLogs: (state, action: PayloadAction<ILog[]>) => {
      state.logs = action.payload;
    },
    setStatusApi: (state, action: PayloadAction<IStatusApi | null>) => {
      state.statusApi = action.payload;
    },
  },
});

export const globalReducer = globalSlice.reducer;
export const { setUser, clearUser, setLogs, setUsers, setLinkApi, setStatusApi, setUsersInscricoes, setInscricoesErro, setInscricoesPendentes, setInscricoesConcluidas } = globalSlice.actions;
