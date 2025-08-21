import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import type { IUserWithCargo, IUserWithCargos } from "../enums/types";
import { setUsers, setUsersInscricoes, setInscricoesPendentes, setInscricoesConcluidas, setLogs, setStatusApi } from "../redux/globalReducer/slice";

export const useWebSocketSync = () => {
  const dispatch = useAppDispatch();
  const { linkApi } = useAppSelector((state) => state.globalReducer);

  const wsUsers = useRef<WebSocket | null>(null);
  const wsInscricoes = useRef<WebSocket | null>(null);
  const wsLogs = useRef<WebSocket | null>(null);
  const wsStatusApi = useRef<WebSocket | null>(null); // <-- novo

  useEffect(() => {
    if (!linkApi) return;

    wsUsers.current = new WebSocket(`${linkApi.replace("http", "ws")}/ws/usuarios`);
    wsUsers.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg?.dados) dispatch(setUsers(msg.dados));
    };

    wsInscricoes.current = new WebSocket(`${linkApi.replace("http", "ws")}/ws/inscricoes`);
    wsInscricoes.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg?.dados) {
        const inscricoesUsuarios = msg.dados;
        const inscricoesPendentes: string[] = [
          ...new Set(inscricoesUsuarios.filter((item: IUserWithCargos) => item.status === "pendente").map((item: IUserWithCargo) => item.cargo.toLowerCase())),
        ] as string[];
        const inscricoesConcluidas: string[] = [
          ...new Set(inscricoesUsuarios.filter((item: IUserWithCargos) => ["concluida", "concluido"].includes(item.status)).map((item: IUserWithCargo) => item.cargo.toLowerCase())),
        ] as string[];

        dispatch(setUsersInscricoes(inscricoesUsuarios));
        dispatch(setInscricoesPendentes(inscricoesPendentes));
        dispatch(setInscricoesConcluidas(inscricoesConcluidas));
      }
    };

    wsLogs.current = new WebSocket(`${linkApi.replace("http", "ws")}/ws/logs`);
    wsLogs.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg?.dados) dispatch(setLogs(msg.dados));
    };

    // === WebSocket para status da API ===
    wsStatusApi.current = new WebSocket(`${linkApi.replace("http", "ws")}/ws/status`);
    wsStatusApi.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      dispatch(setStatusApi(msg.dados ?? msg));
    };

    return () => {
      wsUsers.current?.close();
      wsInscricoes.current?.close();
      wsLogs.current?.close();
      wsStatusApi.current?.close(); // <-- fecha também
    };
  }, [linkApi]);
};
