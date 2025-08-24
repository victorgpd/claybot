import { Tabs as TabsAntd } from "antd";
import styled from "styled-components";

export const PageContainer = styled.div`
  height: 100%;

  flex: 1;

  display: flex;
`;

export const ContainerTabs = styled.div`
  width: 100%;
  height: 100%;
  /* overflow-x: auto; */
  /* white-space: nowrap; */
`;

export const Tabs = styled(TabsAntd)`
  width: 100%;
  height: 100%;

  .ant-tabs-content,
  .ant-tabs-content-top,
  .ant-tabs-tabpane,
  .ant-tabs-tabpane-active {
    width: 100%;
    height: 100%;
    /* overflow-x: auto; */
  }

  .ant-tabs-nav-list {
    overflow-x: auto !important;
    white-space: nowrap;
    scrollbar-width: none;
  }

  .ant-tabs-nav-list::-webkit-scrollbar {
    display: none;
  }
`;
