import axios from "axios";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setInscricoesConcluidas, setInscricoesErro, setInscricoesPendentes, setLogs, setUsers, setUsersInscricoes } from "../redux/globalReducer/slice";
import type { IUser, IUserWithCargo, IUserWithCargos } from "../enums/types";
import { useNotification } from "./useNotification";
import { handleApi } from "./handleApi";

export const useExecute = () => {
  const dispatch = useAppDispatch();
  const notification = useNotification();
  const [loading, setLoading] = useState(false);

  const { linkApi, usersInscricoes, users } = useAppSelector((state) => state.globalReducer);

  const searchUsers = async () => {
    setLoading(true);
    const data = await handleApi(() => axios.get(`${linkApi}/api/users`).then((res) => res.data), notification, "Erro ao buscar usuários");

    if (data) dispatch(setUsers(data));
    setLoading(false);
  };

  const searchInscricoes = async () => {
    setLoading(true);
    const data = await handleApi(() => axios.get(`${linkApi}/api/inscricoes`).then((res) => res.data), notification, "Erro ao buscar inscrições");

    if (data) {
      const inscricoesUsuarios = data;

      const inscricoesErro: string[] = [...new Set(data.filter((item: IUserWithCargos) => item.status === "erro").map((item: IUserWithCargo) => item.cargo.toLowerCase()))] as string[];
      const inscricoesPendentes: string[] = [...new Set(data.filter((item: IUserWithCargos) => item.status === "pendente").map((item: IUserWithCargo) => item.cargo.toLowerCase()))] as string[];
      const inscricoesConcluidas: string[] = [
        ...new Set(data.filter((item: IUserWithCargos) => item.status === "concluida" || item.status === "concluido").map((item: IUserWithCargo) => item.cargo.toLowerCase())),
      ] as string[];

      dispatch(setUsersInscricoes(inscricoesUsuarios));
      dispatch(setInscricoesErro(inscricoesErro));
      dispatch(setInscricoesPendentes(inscricoesPendentes));
      dispatch(setInscricoesConcluidas(inscricoesConcluidas));
    }
    setLoading(false);
  };

  const saveInscricoes = async (inscricoes: { id: number; cargos: string[] }[]) => {
    setLoading(true);

    for (const inscricao of inscricoes) {
      if (!inscricao.id || inscricao.id === 0) {
        notification.error("Todos os usuários devem estar selecionados.");
        setLoading(false);
        return;
      }
      if (!inscricao.cargos || inscricao.cargos.length === 0) {
        notification.error(`O usuário com ID ${inscricao.id} deve ter pelo menos um cargo selecionado.`);
        setLoading(false);
        return;
      }
    }

    const cargoMap = new Map<string, number[]>();
    usersInscricoes.forEach(({ id, cargo }) => {
      if (!cargoMap.has(cargo)) cargoMap.set(cargo, []);
      cargoMap.get(cargo)!.push(id);
    });

    for (const inscricao of inscricoes) {
      for (const cargo of inscricao.cargos) {
        const usuariosComCargo = cargoMap.get(cargo) || [];
        if (usuariosComCargo.includes(inscricao.id)) {
          const user = users.find((u) => u.id === inscricao.id);
          notification.error(`O usuário "${user?.nome}" já está cadastrado para o cargo "${cargo.toLocaleUpperCase()}".`);
          setLoading(false);
          return;
        }
      }
    }

    const response = await handleApi(() => axios.post(`${linkApi}/api/inscricoes`, { usuariosReq: inscricoes }), notification, "Erro ao realizar inscrições");

    if (response) notification.success("Inscrição realizada com sucesso!");
    setLoading(false);
  };

  const deleteInscricao = async (inscricao: { id: number; cargo: string }) => {
    setLoading(true);

    const response = await handleApi(() => axios.delete(`${linkApi}/api/inscricoes`, { data: { usuario: inscricao } }), notification, "Erro ao excluir inscrição");

    if (response) notification.success("Inscrição excluída com sucesso!");
    setLoading(false);
  };

  const updateInscricao = async (inscricao: { status: string; id: number; cargo: string }) => {
    setLoading(true);

    const response = await handleApi(() => axios.put(`${linkApi}/api/inscricoes`, { usuario: inscricao }), notification, "Erro ao atualizar inscrição");

    if (response) notification.success("Inscrição atualizada com sucesso!");
    setLoading(false);
  };

  const deleteAllInscricoesCargo = async (cargo: string) => {
    setLoading(true);

    const response = await handleApi(() => axios.delete(`${linkApi}/api/inscricoes/cargo`, { data: { cargo } }), notification, "Erro ao excluir inscrições do cargo");

    if (response) notification.success("Inscrições excluídas com sucesso!");
    setLoading(false);
  };

  const statusApi = async () => {
    setLoading(true);
    const data = await handleApi(() => axios.get(`${linkApi}/api/status`).then((res) => res.data), notification, "Erro ao obter status da API");
    setLoading(false);
    return data;
  };

  const clearLogs = async () => {
    setLoading(true);
    const response = await handleApi(() => axios.get(`${linkApi}/api/logs/clear`), notification, "Erro ao limpar logs");
    if (response) notification.success("Logs limpos com sucesso!");
    setLoading(false);
  };

  const updateContatoName = async (value: string) => {
    setLoading(true);
    await handleApi(() => axios.post(`${linkApi}/api/contatos?contatoPayload=${value}`), notification, "Erro ao atualizar contato");
    setLoading(false);
  };

  const deleteAllInscricoes = async () => {
    setLoading(true);
    const response = await handleApi(() => axios.get(`${linkApi}/api/inscricoes/delete`), notification, "Erro ao excluir todas as inscrições");
    if (response) notification.success("Todas as inscrições deletadas!");
    setLoading(false);
  };

  const createUser = async (usuario: IUser) => {
    setLoading(true);
    const response = await handleApi(() => axios.post(`${linkApi}/api/users`, usuario), notification, "Erro ao cadastrar usuário");
    if (response) notification.success("Usuário cadastrado com sucesso!");
    setLoading(false);
  };

  const searchLogs = async () => {
    const data = await handleApi(() => axios.get(`${linkApi}/api/logs`).then((res) => res.data), notification, "Erro ao buscar logs");
    if (data) dispatch(setLogs(data));
  };

  return {
    loading,
    createUser,
    searchLogs,
    clearLogs,
    searchInscricoes,
    statusApi,
    updateInscricao,
    updateContatoName,
    saveInscricoes,
    searchUsers,
    deleteInscricao,
    deleteAllInscricoes,
    deleteAllInscricoesCargo,
  };
};
