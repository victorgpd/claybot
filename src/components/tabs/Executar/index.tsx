import Card from "../../Card";
import UserContainer from "../../ContainerUser";
import type { IUserWithCargo, IUserWithCargos } from "../../../enums/types";

import { v4 as uuidv4 } from "uuid";
import { Container } from "../styles";
import { useEffect, useState } from "react";
import { Tabs } from "../../../pages/Home/styles";
import { Button, Modal, Table, type TabsProps } from "antd";
import { useAppSelector } from "../../../redux/hooks";
import { ButtonsTable, ContainerButtons, ContainerButtonsTable, ContainerUsers } from "./styles";
import { useExecute } from "../../../hooks/useExecute";
import { DeleteOutlined } from "@ant-design/icons";

interface IUserWithId extends IUserWithCargos {
  uid: string;
  id: number;
}

const ExecutarTab = () => {
  const { saveInscricoes, loading, deleteInscricao } = useExecute();

  const { inscricoesPendentes, usersInscricoes, users = [] } = useAppSelector((state) => state.globalReducer);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInscricao, setSelectedInscricao] = useState<{ id: number; cargo: string } | null>(null);

  const [usersFieldsArray, setUsersFieldsArray] = useState<IUserWithId[]>([
    {
      uid: uuidv4(),
      id: 0,
      nome: "",
      cpf: "",
      telefone: "",
      genero: "",
      email: "",
      cargos: [],
      status: "",
    },
  ]);

  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  const [items, setItems] = useState<TabsProps["items"]>([]);

  useEffect(() => {
    if (inscricoesPendentes) {
      const itemsInscricoes = inscricoesPendentes.map((inscricao) => {
        const filteredUsers = usersInscricoes.filter((user) => user.cargo.toLowerCase() === inscricao.toLowerCase());

        const customColumns = [
          { title: "Id", dataIndex: "id", key: "id", render: () => uuidv4() },
          { title: "Nome", dataIndex: "nome", key: "nome" },
          { title: "CPF", dataIndex: "cpf", key: "cpf" },
          { title: "Telefone", dataIndex: "telefone", key: "telefone" },
          { title: "Genêro", dataIndex: "genero", key: "genero" },
          { title: "Email", dataIndex: "email", key: "email" },
          { title: "Status", dataIndex: "status", key: "status" },
          { title: "Cargo", key: "cargo", render: () => inscricao.toLocaleUpperCase() },
          {
            title: "Ações",
            key: "action",
            render: (_: unknown, record: IUserWithCargo & Partial<IUserWithId>) => (
              <ContainerButtonsTable>
                <ButtonsTable color="danger" variant="outlined" onClick={() => showModal({ id: record.id!, cargo: record.cargo })}>
                  <DeleteOutlined />
                  <span>Excluir</span>
                </ButtonsTable>
              </ContainerButtonsTable>
            ),
          },
        ];

        return {
          key: inscricao,
          label: inscricao,
          children: (
            <div style={{ height: "100%", overflowY: "auto" }}>
              <Table<IUserWithCargo> rowKey="cpf" columns={customColumns} dataSource={filteredUsers} />
            </div>
          ),
        };
      });

      setItems(itemsInscricoes);
    }
  }, [inscricoesPendentes, usersInscricoes]);

  const handleUserFieldsChange = (uid: string, newFields: Partial<IUserWithId>) => {
    setUsersFieldsArray((prev) => prev.map((user) => (user.uid === uid ? { ...user, ...newFields } : user)));
  };

  const handleCargosChange = (uid: string, values: string[]) => {
    const newOptions = values.filter((val) => !options.some((opt) => opt.value === val)).map((val) => ({ label: val, value: val }));

    setOptions((prevOptions) => [...prevOptions, ...newOptions]);
    handleUserFieldsChange(uid, { cargos: values });
  };

  const handleDeleteUser = (uidToDelete: string) => {
    setUsersFieldsArray((prev) => prev.filter((user) => user.uid !== uidToDelete));
  };

  const handleAddUser = () => {
    const newUser: IUserWithId = {
      uid: uuidv4(),
      id: 0,
      nome: "",
      cpf: "",
      telefone: "",
      genero: "",
      email: "",
      cargos: [],
      status: "",
    };
    setUsersFieldsArray((prev) => [...prev, newUser]);
  };

  const handleSave = () => {
    saveInscricoes(usersFieldsArray);

    setUsersFieldsArray([
      {
        uid: uuidv4(),
        id: 0,
        nome: "",
        cpf: "",
        telefone: "",
        genero: "",
        email: "",
        cargos: [],
        status: "pendente",
      },
    ]);
  };

  const showModal = (inscricao: { id: number; cargo: string }) => {
    setSelectedInscricao(inscricao);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (selectedInscricao) {
      deleteInscricao(selectedInscricao);
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Container>
      <Modal title="Tem certeza que deseja excluir?" closable={{ "aria-label": "Custom Close Button" }} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        {users
          .filter((usuario) => usuario.id == selectedInscricao?.id)
          .map((item) => (
            <>
              <p>Usuário: {item.nome}</p>
              <p>Cargo: {selectedInscricao?.cargo.toLocaleUpperCase()}</p>
            </>
          ))}
      </Modal>

      <Card title="Inscrições pendentes">
        <Tabs type="card" items={items} />
      </Card>

      <Card title="Adicionar usuários à inscrição!">
        <ContainerUsers>
          {usersFieldsArray.map(({ uid, id, ...userFields }) => (
            <UserContainer
              key={uid}
              userFields={{ id: id, ...userFields }}
              options={options}
              selectedUserIds={usersFieldsArray.map((u) => u.id)}
              onUserFieldsChange={(newFields) => handleUserFieldsChange(uid, newFields)}
              onCargosChange={(values) => handleCargosChange(uid, values)}
              onDelete={() => handleDeleteUser(uid)}
            />
          ))}
        </ContainerUsers>
        <ContainerButtons>
          <Button type="primary" onClick={handleSave} loading={loading}>
            Salvar
          </Button>
          <Button type="primary" onClick={handleAddUser}>
            Adicionar usuário
          </Button>
        </ContainerButtons>
      </Card>
    </Container>
  );
};

export default ExecutarTab;
