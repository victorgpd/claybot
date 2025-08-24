import { useEffect, useState } from "react";
import { type TabsProps } from "antd";
import { PageContainer, Tabs } from "./styles";
import ExecutarTab from "../../components/tabs/Executar";
import ConfiguracaoTab from "../../components/tabs/Configuracao";
import { getFromLocalStorage, setToLocalStorage } from "../../utils/localStorage";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setLinkApi } from "../../redux/globalReducer/slice";
import { useNotification } from "../../hooks/useNotification";
import UsuariosTab from "../../components/tabs/Usuarios";
import LogsTab from "../../components/tabs/Logs";
import { useWebSocketSync } from "../../hooks/useWebSocketSync";

const Home = () => {
  const dispatch = useAppDispatch();
  const notification = useNotification();

  const { linkApi } = useAppSelector((state) => state.globalReducer);

  useWebSocketSync();

  useEffect(() => {
    setToLocalStorage("linkApi", "https://unified-muskrat-known.ngrok-free.app");

    const item = getFromLocalStorage("linkApi");
    if (item) {
      dispatch(setLinkApi(item));
    } else {
      notification.warning("Erro!", "Coloque o link do servidor na aba de configurações...");
    }
  }, []);

  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    return new Uint8Array([...rawData].map((c) => c.charCodeAt(0)));
  }

  useEffect(() => {
    async function initPush() {
      if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        return;
      }

      const registration = await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array("BNWp0NtQlopsRn69ogIY4fpPpjxbBzIFWVdjS8v1TUNYsspx7C0inbscLF-KlKMCrpsLlA-bmXsoO9IXpq3Ks1M="),
      });

      await fetch(`${linkApi}/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });
    }

    initPush();
  }, []);

  const [items] = useState<TabsProps["items"]>([
    { label: "Executar", key: "1", children: <ExecutarTab /> },
    { label: "Usuários", key: "2", children: <UsuariosTab /> },
    { label: "Configurações", key: "3", children: <ConfiguracaoTab /> },
    { label: "Logs", key: "4", children: <LogsTab /> },
  ]);

  return (
    <PageContainer>
      <Tabs defaultActiveKey="1" type="card" size="middle" items={items} />
    </PageContainer>
  );
};

export default Home;
