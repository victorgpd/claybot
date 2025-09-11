import Card from "../../Card";
import { Container } from "../styles";
import { ContainerForm, ContainerInput } from "./styles";
import { useEffect, useState } from "react";
import { Button, Input, Modal } from "antd";
import { getFromLocalStorage, setToLocalStorage } from "../../../utils/localStorage";
import { useNotification } from "../../../hooks/useNotification";
import { ClearOutlined, DeleteOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import { useExecute } from "../../../hooks/useExecute";
import { useAppSelector } from "../../../redux/hooks";

const ConfiguracaoTab = () => {
  const notification = useNotification();

  const { user } = useAppSelector((state) => state.globalReducer);
  const { updateContatoName, deleteAllInscricoes, clearLogs } = useExecute();

  const [apiUrl, setApiUrl] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [contatoName, setContatoName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const link = getFromLocalStorage("linkApi");
    setApiUrl(link);

    if (link) {
      setDisabled(true);
    }

    const contatoStorage = getFromLocalStorage("contato");
    setContatoName(contatoStorage);
  }, []);

  useEffect(() => {
    const handleChange = (event: StorageEvent | CustomEvent) => {
      if ("detail" in event) {
        const { key, value } = event.detail as { key: string; value: string };
        if (key === "contato") setContatoName(JSON.parse(value) || "");
        if (key === "linkApi") setApiUrl(JSON.parse(value) || "");
      } else {
        if (event.key === "contato") setContatoName(event.newValue ? JSON.parse(event.newValue) : "");
        if (event.key === "linkApi") setApiUrl(event.newValue ? JSON.parse(event.newValue) : "");
      }
    };

    window.addEventListener("storage", handleChange as EventListener);
    window.addEventListener("localStorageChange", handleChange as EventListener);

    return () => {
      window.removeEventListener("storage", handleChange as EventListener);
      window.removeEventListener("localStorageChange", handleChange as EventListener);
    };
  }, []);

  const handleSave = () => {
    setToLocalStorage("linkApi", apiUrl);
    setDisabled(true);
    notification.success("Link da api salvo com sucesso!");
  };

  const handleEdit = () => {
    setDisabled(!disabled);
  };

  // const handleChange2 = (value: string) => {
  //   updateContatoName(value);
  // };

  const handleOk = () => {
    deleteAllInscricoes();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleShowModal = () => {
    setIsModalOpen(true);
  };

  return (
    <Container>
      <Modal title="Tem certeza que deseja excluir?" closable={{ "aria-label": "Custom Close Button" }} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        Deseja excluir todas as inscrições?
      </Modal>

      <Card title="Configuração">
        <ContainerForm style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ fontWeight: 500 }}>Endereço da API</span>
          <ContainerInput>
            <Input placeholder="Digite o endereço da API" value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} disabled={disabled} />
            <Button variant="outlined" onClick={handleEdit} style={{ width: "100px" }} icon={<EditOutlined />}>
              Editar
            </Button>
          </ContainerInput>

          {user?.email?.includes("victor") && (
            <>
              <span style={{ fontWeight: 500 }}>Selecionar contato ({contatoName})</span>
              <ContainerInput>
                <Input placeholder="Digite o nome do contato" onPressEnter={(e) => updateContatoName(e.currentTarget.value)} style={{ width: "100%" }} />
                {/* <Select
                  style={{ width: 250 }}
                  onChange={handleChange2}
                  options={[
                    { value: "gigroup", label: "GiGroup" },
                    { value: "eu", label: "Eu" },
                  ]}
                /> */}
              </ContainerInput>
            </>
          )}

          <ContainerInput>
            <Button type="primary" onClick={handleSave} style={{ width: "100px" }} icon={<SaveOutlined />}>
              Salvar
            </Button>

            <Button type="primary" onClick={clearLogs} style={{ width: "120px" }} icon={<ClearOutlined />}>
              Limpar log
            </Button>

            {user?.email?.includes("victor") && (
              <Button variant="solid" onClick={handleShowModal} style={{ width: "150px" }} icon={<DeleteOutlined />} color="danger">
                Apagar inscrições
              </Button>
            )}
          </ContainerInput>
        </ContainerForm>
      </Card>
    </Container>
  );
};

export default ConfiguracaoTab;
