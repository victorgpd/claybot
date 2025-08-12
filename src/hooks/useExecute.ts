import axios from "axios";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setInscricoesConcluidas, setInscricoesPendentes, setUsers, setUsersInscricoes } from "../redux/globalReducer/slice";
import type { IUserWithCargo, IUserWithCargos } from "../enums/types";
import { useNotification } from "./useNotification";

export const useExecute = () => {
  const dispatch = useAppDispatch();
  const notification = useNotification();

  const [loading, setLoading] = useState(false);
  const { linkApi } = useAppSelector((state) => state.globalReducer);

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
      await axios.post(`${linkApi}/api/inscricoes`, { usuariosReq: inscricoes });

      await searchInscricoes();

      notification.success("Inscrição realizada com sucesso!");
    } catch {
      console.error();
    }

    setLoading(false);
  };

  const deleteInscricao = async (inscricao: { id: number; cargo: string }) => {
    setLoading(true);

    try {
      await axios.delete(`${linkApi}/api/inscricoes`, { data: { usuario: inscricao } });

      await searchInscricoes();

      notification.success("Inscrição excluida com sucesso!");
    } catch {
      console.error();
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

      await searchInscricoes();
      notification.success("Todas inscrições deletadas!");
    } catch {
      console.error();
    }

    setLoading(false);
  };

  return { loading, searchInscricoes, updateLink, updateContatoName, saveInscricoes, searchUsers, deleteInscricao, deleteAllInscricoes };
};
