import { useEffect, useState } from "react";
import { type TabsProps } from "antd";
import { PageContainer, Tabs } from "./styles";
import ExecutarTab from "../../components/tabs/Executar";
// import { useExecute } from "../../hooks/useExecute";
import ConfiguracaoTab from "../../components/tabs/Configuracao";
import { getFromLocalStorage, setToLocalStorage } from "../../utils/localStorage";
import { useAppDispatch } from "../../redux/hooks";
import { setLinkApi } from "../../redux/globalReducer/slice";
import { useNotification } from "../../hooks/useNotification";
import UsuariosTab from "../../components/tabs/Usuarios";
import LogsTab from "../../components/tabs/Logs";
import { useWebSocketSync } from "../../hooks/useWebSocketSync";

const Home = () => {
  const dispatch = useAppDispatch();
  const notification = useNotification();

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
