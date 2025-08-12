import Card from "../../Card";
import { Container } from "../styles";
import { ContainerForm, ContainerInput } from "./styles";
import { useEffect, useState } from "react";
import { Button, Input, Modal, Select } from "antd";
import { getFromLocalStorage, setToLocalStorage } from "../../../utils/localStorage";
import { useNotification } from "../../../hooks/useNotification";
import { DeleteOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import { useExecute } from "../../../hooks/useExecute";
import { useAppSelector } from "../../../redux/hooks";

const ConfiguracaoTab = () => {
  const notification = useNotification();

  const { user } = useAppSelector((state) => state.globalReducer);
  const { updateLink, updateContatoName, deleteAllInscricoes } = useExecute();

  const [form, setForm] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const link = getFromLocalStorage("linkApi");
    setApiUrl(link);

    if (link) {
      setDisabled(true);
    }

    const formStorage = getFromLocalStorage("form");
    setForm(formStorage);
  }, []);

  const handleSave = () => {
    setToLocalStorage("linkApi", apiUrl);
    setDisabled(true);
    notification.success("Link da api salvo com sucesso!");
  };

  const handleEdit = () => {
    setDisabled(!disabled);
  };

  const handleChange = (value: string) => {
    updateLink(value);
    setToLocalStorage("form", value);
    setForm(value);
  };

  const handleChange2 = (value: string) => {
    updateContatoName(value);
  };

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
              <span style={{ fontWeight: 500 }}>Link do formulario</span>
              <ContainerInput>
                <Select
                  style={{ width: 250 }}
                  onChange={handleChange}
                  value={form}
                  options={[
                    { value: "https://forms.office.com/e/1wLWvYR8kS", label: "Formulário real" },
                    { value: "https://forms.cloud.microsoft/r/Cm6N0frFC8", label: "Formulário teste" },
                  ]}
                />
              </ContainerInput>
              <span style={{ fontWeight: 500 }}>Link do formulario</span>
              <ContainerInput>
                <Select
                  style={{ width: 250 }}
                  onChange={handleChange2}
                  options={[
                    { value: "gigroup", label: "GiGroup" },
                    { value: "eu", label: "Eu" },
                  ]}
                />
              </ContainerInput>

              <Button variant="solid" onClick={handleShowModal} style={{ width: "150px" }} icon={<DeleteOutlined />} color="danger">
                Apagar inscrições
              </Button>
            </>
          )}

          <Button type="primary" onClick={handleSave} style={{ width: "100px" }} icon={<SaveOutlined />}>
            Salvar
          </Button>
        </ContainerForm>
      </Card>
    </Container>
  );
};

export default ConfiguracaoTab;
