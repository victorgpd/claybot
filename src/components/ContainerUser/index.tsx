import styled from "styled-components";
import type { IUserWithCargos } from "../../enums/types";

import { Input, Select, Button } from "antd";
import { useAppSelector } from "../../redux/hooks";

const ContainerUser = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
  align-items: center;

  & > * {
    flex: 1;
    min-width: 0;
  }

  button {
    flex: none;
  }
`;

interface IUserWithId extends IUserWithCargos {
  id: number;
}

interface UserContainerProps {
  userFields: IUserWithId;
  selectedUserIds: number[];
  options: { label: string; value: string }[];

  onDelete: () => void;
  onCargosChange: (values: string[]) => void;
  onUserFieldsChange: (newFields: Partial<IUserWithId>) => void;
}

const UserContainer = ({ userFields, options, selectedUserIds, onUserFieldsChange, onCargosChange, onDelete }: UserContainerProps) => {
  const { users = [] } = useAppSelector((state) => state.globalReducer);

  const onUserSelectChange = (userId: number) => {
    const user = users?.find((u) => u.id === userId);
    if (user) {
      onUserFieldsChange({
        id: userId,
        nome: user.nome,
        cpf: user.cpf,
        telefone: user.telefone,
        genero: user.genero,
        email: user.email,
      });
    }
  };

  const onInputChange = (field: keyof IUserWithCargos, value: string) => {
    onUserFieldsChange({ [field]: value });
  };

  return (
    <ContainerUser>
      <Select
        showSearch
        placeholder="Selecione um usuário"
        optionFilterProp="label"
        onChange={onUserSelectChange}
        value={userFields.id || undefined}
        options={users
          ?.filter((user) => !selectedUserIds.includes(user.id) || user.id === userFields.id)
          .map((user) => ({
            value: user.id,
            label: `${user.nome} (${user.cpf})`,
          }))}
        style={{ minWidth: 200 }}
      />

      <Input placeholder="Nome" value={userFields.nome} onChange={(e) => onInputChange("nome", e.target.value)} disabled={userFields.id ? true : false} />
      <Input placeholder="CPF" value={userFields.cpf} onChange={(e) => onInputChange("cpf", e.target.value)} disabled={userFields.id ? true : false} />
      <Input placeholder="Telefone" value={userFields.telefone} onChange={(e) => onInputChange("telefone", e.target.value)} disabled={userFields.id ? true : false} />
      <Input placeholder="Gênero" value={userFields.genero} onChange={(e) => onInputChange("genero", e.target.value)} disabled={userFields.id ? true : false} />
      <Input placeholder="Email" value={userFields.email} onChange={(e) => onInputChange("email", e.target.value)} disabled={userFields.id ? true : false} />

      <Select mode="tags" allowClear placeholder={`Usuários do grupo`} value={userFields.cargos} onChange={onCargosChange} options={options} />

      <Button danger onClick={onDelete} style={{ flex: "none" }}>
        Remover
      </Button>
    </ContainerUser>
  );
};

export default UserContainer;
