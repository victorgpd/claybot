import styled from "styled-components";

export const ContainerCard = styled.div<{ $minHeightProp?: string }>`
  flex: 1 1 465px;
  width: 100%;
  height: 100%;
  padding: 16px;
  border-radius: 8px;

  ${({ $minHeightProp }) => $minHeightProp && `min-height: ${$minHeightProp};`}

  background-color: #fff;
  overflow-y: auto;
  gap: 12px;
  display: flex;
  flex-flow: column;
  justify-content: space-around;
`;

export const TitleCard = styled.h2`
  font-size: 20px;
`;
