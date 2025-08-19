import Card from "../../Card";
import UserContainer from "../../ContainerUser";
import type { IUserWithCargo, IUserWithCargos } from "../../../enums/types";

import { v4 as uuidv4 } from "uuid";
import { Container } from "../styles";
import { useEffect, useRef, useState } from "react";
import { ContainerTabs, Tabs } from "../../../pages/Home/styles";
import { Button, Modal, Table, type TabsProps } from "antd";
import { useAppSelector } from "../../../redux/hooks";
import { ButtonsTable, ContainerButtons, ContainerButtonsTable, ContainerTable, ContainerUsers } from "./styles";
import { useExecute } from "../../../hooks/useExecute";
import { DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { Key } from "react";

interface IUserWithId extends IUserWithCargos {
  uid: string;
  id: number;
}

const ExecutarTab = () => {
  const tabsRef = useRef<HTMLDivElement>(null);

  const { saveInscricoes, loading, deleteInscricao, deleteAllInscricoesCargo } = useExecute();

  const { usersInscricoes = [], users = [], user } = useAppSelector((state) => state.globalReducer);

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
    if (usersInscricoes.length) {
      const cargosUnicosSet = new Set(usersInscricoes.map((u) => u.cargo.toLowerCase()));
      const cargosUnicos = Array.from(cargosUnicosSet);

      cargosUnicos.sort((a, b) => {
        const regex = /(\d{2})\/(\d{2})/;
        const matchA = a.match(regex);
        const matchB = b.match(regex);

        if (!matchA) return 1;
        if (!matchB) return -1;

        const [, diaA, mesA] = matchA;
        const [, diaB, mesB] = matchB;

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
          label: inscricao.toLocaleUpperCase(),
          children: (
            <ContainerTable>
              <Table<IUserWithCargo> rowKey="cpf" columns={columns} dataSource={filteredUsers} pagination={{ pageSize: 5 }} />
              {user?.email?.includes("victor") && (
                <Button style={{ flex: "0 0 auto", width: "120px" }} variant="outlined" color="danger" icon={<DeleteOutlined />} onClick={() => deleteAllInscricoesCargo(inscricao)}>
                  Excluir tudo
                </Button>
              )}
            </ContainerTable>
          ),
        };
      });

      setItems(itemsInscricoes);
    }
  }, [usersInscricoes, user]);

  useEffect(() => {
    const container = tabsRef.current?.querySelector(".ant-tabs-nav-list") as HTMLElement;
    if (!container) return;

    let startX = 0;
    let scrollLeft = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].pageX - container.offsetLeft;
      startY = e.touches[0].pageY - container.offsetTop;
      scrollLeft = container.scrollLeft;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const x = e.touches[0].pageX - container.offsetLeft;
      const y = e.touches[0].pageY - container.offsetTop;
      const dx = Math.abs(x - startX);
      const dy = Math.abs(y - startY);

      if (dx > dy) {
        if (e.cancelable) {
          e.preventDefault();
        }
        e.stopPropagation();
        container.scrollLeft = scrollLeft - (x - startX);
      }
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

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

      <Card title="Inscrições pendentes" minHeightProp="620px">
        <ContainerTabs ref={tabsRef}>
          <Tabs type="card" items={items} />
        </ContainerTabs>
      </Card>

      <Card title="Adicionar usuários à inscrição!" minHeightProp="580px">
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
