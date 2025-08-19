import styled from "styled-components";

export const ContainerForm = styled.div`
  width: 100%;
  max-width: 768px;
  padding-top: 14px;

  gap: 12px;
  display: flex;
  flex-flow: column;
`;

export const ContainerInput = styled.div`
  width: 100%;

  gap: 12px;
  display: flex;
`;

export const ContainerStatus = styled.div`
  width: 100%;
  margin-top: 120px;

  & > h2 {
    font-size: 20px;
  }
`;
