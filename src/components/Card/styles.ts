import styled from "styled-components";

export const ContainerCard = styled.div<{ $minHeightProp?: string; $maxHeightProp?: string }>`
  flex: 1 1 465px;
  width: 100%;
  height: 100%;
  padding: 16px;
  border-radius: 8px;

  ${({ $minHeightProp }) => $minHeightProp && `min-height: ${$minHeightProp};`}
  ${({ $maxHeightProp }) => $maxHeightProp && `max-height: ${$maxHeightProp};`}

  background-color: #fff;
  overflow-y: auto;
  gap: 12px;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
`;

export const TitleCard = styled.h2`
  font-size: 20px;
`;
