import { Button } from "antd";
import styled from "styled-components";

const colors = {
  backgroundPage: "#fff",
  backgroundCard: "#fff",
  primaryOrange: "#ed6b16",
  textPrimary: "#000",
  textSecondary: "#5a5b5f",
  error: "#ff4d4f",
};

export const ContainerPageLogin = styled.div`
  height: 100%;
  padding: 20px;

  background-color: ${colors.backgroundPage};

  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ContainerLogin = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 30px 25px;
  border-radius: 10px;

  background-color: ${colors.backgroundCard};

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;

  box-shadow: 0 4px 12px rgb(0 0 0 / 0.1);
`;

export const Logo = styled.img`
  height: 100px;
  object-fit: contain;
`;

export const ContainerTextLogin = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

export const TitleLogin = styled.h2`
  margin: 0;
  color: ${colors.textPrimary};
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 0.03em;
`;

export const LoginMessage = styled.p`
  margin: 0;
  color: ${colors.textSecondary};
  font-size: 16px;
  font-weight: 400;
`;

export const ForgotPasswordText = styled.p`
  width: 100%;
  max-width: 270px;

  margin: 0;
  padding-top: 5px;

  color: #1677ff;
  font-size: 14px;
  font-weight: 600;

  cursor: pointer;
  text-align: right;
  user-select: none;

  transition: text-decoration 0.2s ease;

  &:hover,
  &:focus {
    text-decoration: underline;
  }
`;

export const BackDrop = styled.div<{ $isOpenForgotPassword: boolean }>`
  ${({ $isOpenForgotPassword }) =>
    !$isOpenForgotPassword &&
    `opacity: 0;
  visibility: hidden;`}

  transition: opacity 0.3s, visibility 0.3s;

  width: 100%;
  height: 100%;

  background-color: rgba(0, 0, 0, 0.6);

  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
`;

export const ContainerForgotPassword = styled.div<{ $isOpenForgotPassword: boolean }>`
  ${({ $isOpenForgotPassword }) =>
    !$isOpenForgotPassword &&
    `opacity: 0;
  visibility: hidden;`}

  transition: opacity 0.5s, visibility 0.5s;

  width: 100%;
  max-width: 400px;
  padding: 30px 25px;
  border-radius: 10px;

  background-color: ${colors.backgroundCard};

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;

  box-shadow: 0 4px 12px rgb(0 0 0 / 0.1);

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  z-index: 11;
`;

export const ButtonClose = styled(Button)`
  position: absolute;
  top: 10px;
  right: 10px;
`;
