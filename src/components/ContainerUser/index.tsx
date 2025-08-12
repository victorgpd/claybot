import styled from "styled-components";
import type { IUserWithCargos } from "../../enums/types";

import { Input, Select, Button } from "antd";
import { useAppSelector } from "../../redux/hooks";

const ContainerUser = styled.div`
  flex: 0 0 auto;

  width: 250px;

  gap: 10px;
  display: flex;
  flex-flow: column wrap;
  align-items: center;

  & > * {
    flex: 1;
    min-width: 0;
  }

  button {
    flex: none;
  }
`;

const InputFormated = styled(Input)`
  width: 100%;
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
        style={{ width: "100%" }}
      />

      <InputFormated placeholder="Nome" value={userFields.nome} onChange={(e) => onInputChange("nome", e.target.value)} disabled={userFields.id ? true : false} />
      <InputFormated placeholder="CPF" value={userFields.cpf} onChange={(e) => onInputChange("cpf", e.target.value)} disabled={userFields.id ? true : false} />
      <InputFormated placeholder="Telefone" value={userFields.telefone} onChange={(e) => onInputChange("telefone", e.target.value)} disabled={userFields.id ? true : false} />
      <InputFormated placeholder="Gênero" value={userFields.genero} onChange={(e) => onInputChange("genero", e.target.value)} disabled={userFields.id ? true : false} />
      <InputFormated placeholder="Email" value={userFields.email} onChange={(e) => onInputChange("email", e.target.value)} disabled={userFields.id ? true : false} />

      <Select mode="tags" allowClear placeholder={`Cargos`} value={userFields.cargos} onChange={onCargosChange} options={options} style={{ width: "100%" }} />

      <Button danger onClick={onDelete} style={{ flex: "none" }}>
        Remover
      </Button>
    </ContainerUser>
  );
};

export default UserContainer;
