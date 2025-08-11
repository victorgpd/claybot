import Card from "../../Card";
import { Container } from "../styles";
import { ContainerForm, ContainerInput } from "./styles";
import { useEffect, useState } from "react";
import { Button, Input } from "antd";
import { getFromLocalStorage, setToLocalStorage } from "../../../utils/localStorage";
import { useNotification } from "../../../hooks/useNotification";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";

const ConfiguracaoTab = () => {
  const notification = useNotification();
  const [apiUrl, setApiUrl] = useState("");
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const item = getFromLocalStorage("linkApi");
    setApiUrl(item);

    if (item) {
      setDisabled(true);
    }
  }, []);

  const handleSave = () => {
    setToLocalStorage("linkApi", apiUrl);
    notification.success("Link da api salvo com sucesso!");
  };

  const handleEdit = () => {
    setDisabled(!disabled);
  };

  return (
    <Container>
      <Card title="Configuração">
        <ContainerForm style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ fontWeight: 500 }}>Endereço da API</span>
          <ContainerInput>
            <Input placeholder="Digite o endereço da API" value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} disabled={disabled} />
            <Button variant="outlined" onClick={handleEdit} style={{ width: "100px" }} icon={<EditOutlined />}>
              Editar
            </Button>
          </ContainerInput>
          <Button type="primary" onClick={handleSave} style={{ width: "100px" }} icon={<SaveOutlined />}>
            Salvar
          </Button>
        </ContainerForm>
      </Card>
    </Container>
  );
};

export default ConfiguracaoTab;
