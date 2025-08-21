import axios from "axios";
import { useNotification } from "./useNotification";

export const handleApi = async <T>(apiCall: () => Promise<T>, notification: ReturnType<typeof useNotification>, errorMessage?: string): Promise<T | null> => {
  try {
    return await apiCall();
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
        notification.warning("Servidor indisponível!", "Entre em contato com o administrador para resolver.");
      } else {
        console.error("Erro Axios:", error.message);
      }
    } else {
      notification.warning(errorMessage || "Erro desconhecido na API:");
    }
    return null;
  }
};
