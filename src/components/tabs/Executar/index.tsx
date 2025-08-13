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
import type { ColumnsType } from "antd/es/table";
import type { Key } from "react";

interface IUserWithId extends IUserWithCargos {
  uid: string;
  id: number;
}

const ExecutarTab = () => {
  const { saveInscricoes, loading, deleteInscricao } = useExecute();

  const { inscricoesPendentes = [], inscricoesConcluidas = [], usersInscricoes = [], users = [] } = useAppSelector((state) => state.globalReducer);

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
    if (inscricoesPendentes.length || inscricoesConcluidas.length) {
      const cargosUnicos = Array.from(new Set([...inscricoesPendentes, ...inscricoesConcluidas])).sort((a, b) => {
        const regex = /(\d{2})\/(\d{2})$/;
        const [, diaA, mesA] = a.match(regex) || [];
        const [, diaB, mesB] = b.match(regex) || [];

        if (!diaA || !mesA) return 1;
        if (!diaB || !mesB) return -1;

        const dataA = new Date(new Date().getFullYear(), parseInt(mesA) - 1, parseInt(diaA));
        const dataB = new Date(new Date().getFullYear(), parseInt(mesB) - 1, parseInt(diaB));

        return dataA.getTime() - dataB.getTime();
      });

      const itemsInscricoes = cargosUnicos.map((inscricao) => {
        const filteredUsers = usersInscricoes.filter((user) => user.cargo.toLowerCase() === inscricao);

        const columns: ColumnsType<IUserWithCargo> = [
          { title: "Id", dataIndex: "id", key: "id", render: () => uuidv4() },
          { title: "Nome", dataIndex: "nome", key: "nome" },
          { title: "CPF", dataIndex: "cpf", key: "cpf" },
          { title: "Telefone", dataIndex: "telefone", key: "telefone" },
          { title: "Genêro", dataIndex: "genero", key: "genero" },
          { title: "Email", dataIndex: "email", key: "email" },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            filters: [
              { text: "Erro", value: "erro" },
              { text: "Pendente", value: "pendente" },
              { text: "Concluído", value: "concluido" },
            ],
            onFilter: (value: Key | boolean, record) => record.status === value,
            render: (_: unknown, record: IUserWithCargo & Partial<IUserWithId>) => {
              let color: string;
              switch (record.status) {
                case "erro":
                  color = "#ff4d4f";
                  break;
                case "pendente":
                  color = "#faad14";
                  break;
                case "concluida":
                  color = "#52c41a";
                  break;
                default:
                  color = "blue";
              }
              return <span style={{ color }}>{record.status}</span>;
            },
          },
          {
            title: "Cargo",
            key: "cargo",
            render: () => inscricao.toLocaleUpperCase(),
          },
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
          label: inscricao.toLocaleUpperCase(),
          children: (
            <div style={{ height: "100%" }}>
              <Table<IUserWithCargo> rowKey="cpf" columns={columns} dataSource={filteredUsers} pagination={{ pageSize: 12 }} />
            </div>
          ),
        };
      });

      setItems(itemsInscricoes);
    }
  }, [inscricoesPendentes, inscricoesConcluidas, usersInscricoes]);

  const handleUserFieldsChange = (uid: string, newFields: Partial<IUserWithId>) => {
    setUsersFieldsArray((prev) => prev.map((user) => (user.uid === uid ? { ...user, ...newFields } : user)));
  };

  const handleCargosChange = (uid: string, values: string[]) => {
    const uniqueValues = Array.from(new Set(values));

    const newOptions = uniqueValues.filter((val) => !options.some((opt) => opt.value === val)).map((val) => ({ label: val, value: val }));

    setOptions((prevOptions) => {
      const combined = [...prevOptions, ...newOptions];
      const uniqueCombined = combined.filter((opt, index) => combined.findIndex((o) => o.value === opt.value) === index);
      return uniqueCombined;
    });

    handleUserFieldsChange(uid, { cargos: uniqueValues });
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
          .filter((usuario) => usuario.id === selectedInscricao?.id)
          .map((item) => (
            <div key={item.id}>
              <p>Usuário: {item.nome}</p>
              <p>Cargo: {selectedInscricao?.cargo.toLocaleUpperCase()}</p>
            </div>
          ))}
      </Modal>

      <Card title="Inscrições pendentes" minHeightProp="560px">
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
