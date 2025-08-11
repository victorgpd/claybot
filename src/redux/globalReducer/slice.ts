import type { IAuthUser, IUserWithCargo, IUserWithId } from "../../enums/types";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface initialStateType {
  user: IAuthUser | null;
  users: IUserWithId[];
  usersInscricoes: IUserWithCargo[];

  inscricoesPendentes: string[];
  inscricoesConcluidas: string[];

  linkApi: string;
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
  inscricoesPendentes: [],
  inscricoesConcluidas: [],

  linkApi: "",
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
    setUsersInscricoes: (state, action: PayloadAction<IUserWithCargo[]>) => {
      state.usersInscricoes = action.payload;
    },
    setInscricoesPendentes: (state, action: PayloadAction<string[]>) => {
      state.inscricoesPendentes = action.payload;
    },
    setInscricoesConcluidas: (state, action: PayloadAction<string[]>) => {
      state.inscricoesConcluidas = action.payload;
    },
  },
});

export const globalReducer = globalSlice.reducer;
export const { setUser, clearUser, setUsers, setLinkApi, setUsersInscricoes, setInscricoesPendentes, setInscricoesConcluidas } = globalSlice.actions;
