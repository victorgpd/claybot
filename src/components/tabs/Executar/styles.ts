import { Button } from "antd";
import styled from "styled-components";

export const ContainerUsers = styled.div`
  width: 100%;
  height: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;

  overflow-y: auto;

  gap: 15px;
  display: flex;
  flex-flow: row;
`;

export const ContainerButtons = styled.div`
  width: 100%;

  gap: 15px;
  display: flex;
  justify-content: center;
`;

export const ContainerButtonsTable = styled.div`
  display: flex;
  gap: 12px;
`;

export const ButtonsTable = styled(Button)`
  svg {
    font-size: 16px;
  }
`;

export const ContainerTable = styled.div`
  height: 100%;

  gap: 10px;
  display: flex;
  flex-flow: column;

  position: relative;
`;
