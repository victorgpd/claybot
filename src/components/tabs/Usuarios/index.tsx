import { Table, Form, Input, Button } from "antd";
import Card from "../../Card";
import { Container } from "../styles";
import { type IUser, type IUserWithId } from "../../../enums/types";
import { ButtonsTable, ContainerButtonsTable } from "./styles";
import { DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import { useAppSelector } from "../../../redux/hooks";
import { useExecute } from "../../../hooks/useExecute";

const UsuariosTab = () => {
  const { users } = useAppSelector((state) => state.globalReducer);

  const { createUser } = useExecute();

  const [form] = Form.useForm<IUser>();

  const columns = [
    { title: "Id", dataIndex: "id", key: "id" },
    { title: "Nome", dataIndex: "nome", key: "nome" },
    { title: "CPF", dataIndex: "cpf", key: "cpf" },
    { title: "Telefone", dataIndex: "telefone", key: "telefone" },
    { title: "Genêro", dataIndex: "genero", key: "genero" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Ações",
      key: "action",
      render: (_: unknown, record: IUserWithId & Partial<IUserWithId>) => (
        <ContainerButtonsTable>
          <ButtonsTable color="danger" variant="outlined">
            <DeleteOutlined />
            <span>Excluir</span>
          </ButtonsTable>
        </ContainerButtonsTable>
      ),
    },
  ];

  const onFinish = (values: IUser) => {
    console.log("Novo usuário:", values);

    createUser(values);

    form.resetFields();
  };

  return (
    <Container>
      <Card title="Usuários" minHeightProp="519px">
        <Table<IUserWithId> rowKey="cpf" columns={columns} dataSource={users} pagination={{ pageSize: 5 }} style={{ height: "100%" }} />
      </Card>

      <Card title="Adicionar usuário" minHeightProp="565px">
        <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 500 }}>
          <Form.Item label="Nome" name="nome" rules={[{ required: true, message: "Informe o nome" }]}>
            <Input placeholder="Digite o nome" />
          </Form.Item>

          <Form.Item label="CPF" name="cpf" rules={[{ required: true, message: "Informe o CPF" }]}>
            <Input placeholder="Digite o CPF" />
          </Form.Item>

          <Form.Item label="Telefone" name="telefone" rules={[{ required: true, message: "Informe o telefone" }]}>
            <Input placeholder="Digite o telefone" />
          </Form.Item>

          <Form.Item label="Gênero" name="genero" rules={[{ required: true, message: "Informe o gênero" }]}>
            <Input placeholder="Digite o gênero" />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Informe um email válido" }]}>
            <Input placeholder="Digite o email" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              Salvar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Container>
  );
};

export default UsuariosTab;
