import axios from "axios";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setInscricoesConcluidas, setInscricoesPendentes, setLogs, setUsers, setUsersInscricoes } from "../redux/globalReducer/slice";
import type { IUser, IUserWithCargo, IUserWithCargos } from "../enums/types";
import { useNotification } from "./useNotification";

export const useExecute = () => {
  const dispatch = useAppDispatch();
  const notification = useNotification();

  const [loading, setLoading] = useState(false);
  const { linkApi, usersInscricoes, users } = useAppSelector((state) => state.globalReducer);

  const searchUsers = async () => {
    setLoading(true);

    try {
      const { data } = await axios.get(`${linkApi}/api/users`);
      dispatch(setUsers(data));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
          notification.warning("Servidor indisponivel!", "Entre em contanto com o adm para resolver.");
        } else {
          console.error("Erro Axios:", error.message);
        }
      } else {
        console.error("Erro desconhecido ao buscar usuários:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const searchInscricoes = async () => {
    setLoading(true);

    try {
      const { data } = await axios.get(`${linkApi}/api/inscricoes`);

      const inscricoesUsuarios = data;

      const inscricoesPendentes: string[] = [...new Set(data.filter((item: IUserWithCargos) => item.status === "pendente").map((item: IUserWithCargo) => item.cargo.toLowerCase()))] as string[];

      const inscricoesConcluidas: string[] = [
        ...new Set(data.filter((item: IUserWithCargos) => item.status === "concluida" || item.status === "concluido").map((item: IUserWithCargo) => item.cargo.toLowerCase())),
      ] as string[];

      dispatch(setUsersInscricoes(inscricoesUsuarios));
      dispatch(setInscricoesPendentes(inscricoesPendentes));
      dispatch(setInscricoesConcluidas(inscricoesConcluidas));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
          notification.warning("Servidor indisponivel!", "Entre em contanto com o adm para resolver.");
        } else {
          console.error("Erro Axios:", error.message);
        }
      } else {
        console.error("Erro desconhecido ao buscar inscrições:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const saveInscricoes = async (inscricoes: { id: number; cargos: string[] }[]) => {
    setLoading(true);

    try {
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
        if (!cargoMap.has(cargo)) {
          cargoMap.set(cargo, []);
        }
        cargoMap.get(cargo)!.push(id);
      });

      for (const inscricao of inscricoes) {
        for (const cargo of inscricao.cargos) {
          const usuariosComCargo = cargoMap.get(cargo) || [];

          const usuarioJaCadastrado = usuariosComCargo.includes(inscricao.id);

          if (usuarioJaCadastrado) {
            const user = users.find((usuario) => usuario.id === inscricao.id);
            notification.error(`O usuário "${user?.nome}" já está cadastrado para o cargo "${cargo.toLocaleUpperCase()}".`);
            setLoading(false);
            return;
          }
        }
      }

      await axios.post(`${linkApi}/api/inscricoes`, { usuariosReq: inscricoes });

      notification.success("Inscrição realizada com sucesso!");
    } catch {
      notification.error("Erro ao realizar inscrições!");
    }

    setLoading(false);
  };

  const deleteInscricao = async (inscricao: { id: number; cargo: string }) => {
    setLoading(true);

    try {
      await axios.delete(`${linkApi}/api/inscricoes`, { data: { usuario: inscricao } });

      notification.success("Inscrição excluida com sucesso!");
    } catch {
      notification.error("Erro ao excluir usuário!");
    }

    setLoading(false);
  };

  const updateLink = async (value: string) => {
    setLoading(true);

    try {
      await axios.post(`${linkApi}/api/link`, { link: value });
    } catch {
      console.error();
    }

    setLoading(false);
  };

  const updateContatoName = async (value: string) => {
    setLoading(true);

    try {
      await axios.post(`${linkApi}/api/contatos?contatoPayload=${value}`);
    } catch {
      console.error();
    }

    setLoading(false);
  };

  const deleteAllInscricoes = async () => {
    setLoading(true);

    try {
      await axios.get(`${linkApi}/api/inscricoes/delete`);

      notification.success("Todas inscrições deletadas!");
    } catch {
      notification.error("Erro ao excluir as inscrições.");
    }

    setLoading(false);
  };

  const createUser = async (usuario: IUser) => {
    setLoading(true);

    try {
      await axios.post(`${linkApi}/api/users`, usuario);

      notification.success("Usuário cadastrado com sucesso!");
    } catch {
      notification.error("Erro ao cadastrar usuário!");
    } finally {
      setLoading(false);
    }
  };

  const searchLogs = async () => {
    try {
      const { data } = await axios.get(`${linkApi}/api/logs`);
      dispatch(setLogs(data));
    } catch {
      console.error();
    }
  };

  return { loading, createUser, searchLogs, searchInscricoes, updateLink, updateContatoName, saveInscricoes, searchUsers, deleteInscricao, deleteAllInscricoes };
};
