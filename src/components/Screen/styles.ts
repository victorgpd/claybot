import styled from "styled-components";

export const Header = styled.header`
  width: 100%;
  height: 72px;
  padding: 7px 15px;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  & > img {
    height: 100%;
  }

  gap: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  z-index: 999;
`;

export const Main = styled.main`
  flex: 1;
  padding: 16px;
  background-color: #fff;
`;

export const ContainerPage = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
`;
