import { useEffect, useState } from "react";
import { type TabsProps } from "antd";
import { PageContainer, Tabs } from "./styles";
import ExecutarTab from "../../components/tabs/Executar";
import { useExecute } from "../../hooks/useExecute";
import ConfiguracaoTab from "../../components/tabs/Configuracao";
import { getFromLocalStorage } from "../../utils/localStorage";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setLinkApi } from "../../redux/globalReducer/slice";
import { useNotification } from "../../hooks/useNotification";

const Home = () => {
  const dispatch = useAppDispatch();
  const notification = useNotification();

  const { searchInscricoes, searchUsers } = useExecute();
  const { linkApi } = useAppSelector((state) => state.globalReducer);

  useEffect(() => {
    const item = getFromLocalStorage("linkApi");
    if (item) {
      dispatch(setLinkApi(item));
    } else {
      notification.warning("Erro!", "Coloque o link do servidor na aba de configurações...");
    }
  }, []);

  useEffect(() => {
    if (linkApi) {
      searchUsers();
      searchInscricoes();
    }
  }, [linkApi]);

  const [items] = useState<TabsProps["items"]>([
    {
      label: "Executar",
      key: "1",
      children: <ExecutarTab />,
    },
    {
      label: "Usuários",
      key: "2",
      children: "Content of editable tab 2",
    },
    {
      label: "Configurações",
      key: "3",
      children: <ConfiguracaoTab />,
    },
    {
      label: "Logs",
      key: "4",
      children: "Content of editable tab 4",
    },
  ]);

  return (
    <PageContainer>
      <Tabs defaultActiveKey="1" type="card" size="middle" items={items} />
    </PageContainer>
  );
};

export default Home;
