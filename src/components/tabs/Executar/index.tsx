import Card from "../../Card";
import UserContainer from "../../ContainerUser";
import type { IUserWithCargo, IUserWithCargos } from "../../../enums/types";

import type { Key, ReactElement, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { Container } from "../styles";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../../redux/hooks";
import { useExecute } from "../../../hooks/useExecute";
import { Button, Modal, Select, Spin, Table, Tabs } from "antd";
import { ContainerTabs } from "../../../pages/Home/styles";
import { CheckSquareOutlined, ClockCircleOutlined, DeleteOutlined, WarningOutlined, UsergroupAddOutlined, LoadingOutlined, SyncOutlined } from "@ant-design/icons";
import { ButtonsTable, ContainerButtons, ContainerButtonsTable, ContainerInputs, ContainerTable, ContainerUsers } from "./styles";

interface IUserWithId extends IUserWithCargos {
  uid: string;
  id: number;
}

const ExecutarTab = () => {
  const tabsRef = useRef<HTMLDivElement>(null);

  const { saveInscricoes, loading, deleteInscricao, deleteAllInscricoesCargo, updateInscricao, registerInscricao } = useExecute();
  const { usersInscricoes = [], users = [], user, statusApi } = useAppSelector((state) => state.globalReducer);

  const [linkPorCargo, setLinkPorCargo] = useState<Record<string, string>>({});
  const [optionsPorCargo, setOptionsPorCargo] = useState<Record<string, { label: string; value: string }[]>>({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInscricao, setSelectedInscricao] = useState<{ id: number; cargo: string } | null>(null);

  const [usersFieldsArray, setUsersFieldsArray] = useState<IUserWithId[]>([{ uid: uuidv4(), id: 0, nome: "", cpf: "", telefone: "", genero: "", email: "", cargos: [], status: "" }]);

  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  const [items, setItems] = useState<React.ComponentProps<typeof Tabs>["items"]>([]);

  const [cardsData, setCardsData] = useState<{ title: string; value: string | number | ReactNode; color: string; icon: ReactElement }[]>([]);

  const handleChangeLink = (cargo: string, value: string[]) => {
    const lastValue = value[value.length - 1] || "";

    setLinkPorCargo((prev) => ({
      ...prev,
      [cargo]: lastValue,
    }));

    setOptionsPorCargo((prev) => {
      const defaultOptions = [
        { value: "https://forms.office.com/e/1wLWvYR8kS", label: "https://forms.office.com/e/1wLWvYR8kS" },
        { value: "https://forms.cloud.microsoft/r/Cm6N0frFC8", label: "https://forms.cloud.microsoft/r/Cm6N0frFC8" },
        { value: "https://forms.cloud.microsoft/r/YVsn49HPeU", label: "https://forms.cloud.microsoft/r/YVsn49HPeU" },
      ];

      const prevOptions = prev[cargo] || defaultOptions;

      if (lastValue && !prevOptions.some((opt) => opt.value === lastValue)) {
        return {
          ...prev,
          [cargo]: [...prevOptions, { label: lastValue, value: lastValue }],
        };
      }

      return prev;
    });
  };

  useEffect(() => {
    setCardsData([
      {
        title: "Lendo mensagens",
        value: statusApi === null ? <Spin size="default" indicator={<LoadingOutlined />} /> : statusApi.driverAtivo ? "Sim" : "Não",
        color: "#1890ff",
        icon: <ClockCircleOutlined style={{ fontSize: "24px", color: "#1890ff" }} />,
      },
      {
        title: "Concluídas",
        value: statusApi === null ? <Spin size="default" indicator={<LoadingOutlined />} /> : usersInscricoes.filter((u) => ["concluida", "concluido"].includes(u.status)).length,
        color: "#52c41a",
        icon: <CheckSquareOutlined style={{ fontSize: "24px", color: "#52c41a" }} />,
      },
      {
        title: "Pendentes",
        value: statusApi === null ? <Spin size="default" indicator={<LoadingOutlined />} /> : statusApi?.inscricoesPendentes ?? 0,
        color: "#faad14",
        icon: <ClockCircleOutlined style={{ fontSize: "24px", color: "#faad14" }} />,
      },
      {
        title: "Com Erro",
        value: statusApi === null ? <Spin size="default" indicator={<LoadingOutlined />} /> : usersInscricoes.filter((u) => u.status === "erro").length,
        color: "#ff4d4f",
        icon: <WarningOutlined style={{ fontSize: "24px", color: "#ff4d4f" }} />,
      },
      {
        title: "Rodando",
        value:
          statusApi === null ? (
            <Spin size="default" indicator={<LoadingOutlined />} />
          ) : (statusApi.inscricoesRodando?.length ?? 0) < 1 ? (
            "Nenhuma"
          ) : (
            statusApi.inscricoesRodando.map((value) => `(${value.toLocaleUpperCase()})`).join(", ")
          ),
        color: "#36cfc9",
        icon: <SyncOutlined style={{ fontSize: "24px", color: "#36cfc9" }} />,
      },
      {
        title: "Cargos Ativos",
        value: statusApi === null ? <Spin size="default" indicator={<LoadingOutlined />} /> : Array.from(new Set(usersInscricoes.map((u) => u.cargo.toUpperCase()))).length,
        color: "#722ed1",
        icon: <UsergroupAddOutlined style={{ fontSize: "24px", color: "#722ed1" }} />,
      },
    ]);
  }, [statusApi, usersInscricoes]);

  useEffect(() => {
    if (!usersInscricoes.length) return;

    const cargosUnicos = Array.from(new Set(usersInscricoes.map((u) => u.cargo.toLowerCase()))).sort();

    const itemsInscricoes = cargosUnicos.map((inscricao) => {
      const filteredUsers = usersInscricoes.filter((u) => u.cargo.toLowerCase() === inscricao);

      const ajustedUsers = filteredUsers.map((userFilter, i) => ({ ...userFilter, uid: `${i + 1}` }));

      const columns: ColumnsType<IUserWithCargo & Partial<IUserWithId>> = [
        { title: "Id", dataIndex: "uid", key: "uid" },
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
          render: (_, record) => {
            const color = record.status === "erro" ? "#ff4d4f" : record.status === "pendente" ? "#faad14" : "#52c41a";
            return <span style={{ color }}>{record.status}</span>;
          },
        },
        { title: "Cargo", key: "cargo", render: () => inscricao.toUpperCase() },
        {
          title: "Ações",
          key: "action",
          render: (_, record) => (
            <ContainerButtonsTable>
              <ButtonsTable color="green" variant="outlined" onClick={() => updateInscricao({ status: "concluida", id: record.id!, cargo: record.cargo })}>
                <CheckSquareOutlined />
                <span>Concluída</span>
              </ButtonsTable>
              <ButtonsTable color="orange" variant="outlined" onClick={() => updateInscricao({ status: "pendente", id: record.id!, cargo: record.cargo })}>
                <ClockCircleOutlined />
                <span>Pendente</span>
              </ButtonsTable>
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
        label: inscricao.toUpperCase(),
        children: (
          <ContainerTable>
            <ContainerInputs>
              <Select
                variant="underlined"
                mode="tags"
                placeholder="Link para inscrição"
                value={linkPorCargo[inscricao] ? [linkPorCargo[inscricao]] : []}
                onChange={(value) => handleChangeLink(inscricao, value)}
                style={{ flex: "1 0 auto", width: "100%", maxWidth: "500px" }}
                options={
                  optionsPorCargo[inscricao] || [
                    { value: "https://forms.office.com/e/1wLWvYR8kS", label: "https://forms.office.com/e/1wLWvYR8kS" },
                    { value: "https://forms.cloud.microsoft/r/Cm6N0frFC8", label: "https://forms.cloud.microsoft/r/Cm6N0frFC8" },
                    { value: "https://forms.cloud.microsoft/r/YVsn49HPeU", label: "https://forms.cloud.microsoft/r/YVsn49HPeU" },
                  ]
                }
              />

              <Button
                style={{ flex: "1 0 auto", maxWidth: "150px" }}
                variant="outlined"
                color="primary"
                onClick={() => registerInscricao({ cargoRequest: inscricao, linkRequest: linkPorCargo[inscricao] })}
              >
                Inscrever
              </Button>

              <Button style={{ flex: "1 0 auto", maxWidth: "150px" }} variant="outlined" color="danger" onClick={() => deleteAllInscricoesCargo(inscricao)}>
                Excluir tudo
              </Button>
            </ContainerInputs>
            <Table<IUserWithCargo & Partial<IUserWithId>>
              rowKey="cpf"
              columns={columns}
              dataSource={ajustedUsers}
              pagination={{ pageSize: 5 }}
              scroll={{ x: "max-content" }}
              style={{ scrollbarWidth: "none" }}
            />
          </ContainerTable>
        ),
      };
    });

    setItems(itemsInscricoes);
  }, [usersInscricoes, user, linkPorCargo, optionsPorCargo]);

  const handleUserFieldsChange = (uid: string, newFields: Partial<IUserWithId>) => setUsersFieldsArray((prev) => prev.map((u) => (u.uid === uid ? { ...u, ...newFields } : u)));

  const handleCargosChange = (uid: string, values: string[]) => {
    const uniqueValues = Array.from(new Set(values));
    const newOptions = uniqueValues.filter((val) => !options.some((opt) => opt.value === val)).map((val) => ({ label: val, value: val }));
    setOptions((prev) => [...prev, ...newOptions]);
    handleUserFieldsChange(uid, { cargos: uniqueValues });
  };

  const handleDeleteUser = (uid: string) => setUsersFieldsArray((prev) => prev.filter((u) => u.uid !== uid));

  const handleAddUser = () => setUsersFieldsArray((prev) => [...prev, { uid: uuidv4(), id: 0, nome: "", cpf: "", telefone: "", genero: "", email: "", cargos: [], status: "" }]);

  const handleSave = () => {
    saveInscricoes(usersFieldsArray);
    setUsersFieldsArray([{ uid: uuidv4(), id: 0, nome: "", cpf: "", telefone: "", genero: "", email: "", cargos: [], status: "pendente" }]);
  };

  const showModal = (inscricao: { id: number; cargo: string }) => {
    setSelectedInscricao(inscricao);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (selectedInscricao) deleteInscricao(selectedInscricao);
    setIsModalOpen(false);
  };

  const handleCancel = () => setIsModalOpen(false);

  return (
    <Container>
      <Modal title="Tem certeza que deseja excluir?" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        {users
          .filter((u) => u.id === selectedInscricao?.id)
          .map((item) => (
            <div key={item.id}>
              <p>Usuário: {item.nome}</p>
              <p>Cargo: {selectedInscricao?.cargo.toUpperCase()}</p>
            </div>
          ))}
      </Modal>

      <div style={{ display: "flex", gap: "16px", marginBottom: "40px", flexFlow: "row wrap" }}>
        {cardsData?.map((card) => (
          <Card key={card.title} title={card.title} maxHeightProp="190px">
            <div>
              <div style={{ fontSize: "16px", fontWeight: 500, color: card.color }}>{card.title}</div>
              <div style={{ fontSize: "28px", fontWeight: 700 }}>{card.value}</div>
            </div>
            <div>{card.icon}</div>
          </Card>
        ))}
      </div>

      <Card title="Inscrições pendentes" minHeightProp="640px">
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
