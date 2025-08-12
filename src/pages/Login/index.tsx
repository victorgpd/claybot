import useTitle from "../../hooks/useTitle";
import Isologo from "../../assets/isologo.png";

import { useState } from "react";
import { Input, Button, Form } from "antd";
import { Controller, useForm } from "react-hook-form";
import { CloseOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { ContainerLogin, ContainerPageLogin, ContainerTextLogin, LoginMessage, Logo, TitleLogin, ForgotPasswordText, BackDrop, ContainerForgotPassword, ButtonClose } from "./styles";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

type LoginFormData = {
  email: string;
  password: string;
};

const Login = () => {
  useTitle("Login");

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const { login, loading } = useAuth(navigate);

  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const alternateForgotPassword = () => {
    setIsForgotPasswordOpen(!isForgotPasswordOpen);
  };

  const onSubmitLogin = async (data: LoginFormData) => {
    await login(data.email, data.password);
  };

  const onSubmitForgotPassword = async (data: LoginFormData) => {
    console.log(data);
  };

  return (
    <ContainerPageLogin>
      <ContainerLogin role="main" aria-label="Área de login">
        <Logo src={Isologo} alt="Logo da aplicação" />

        <ContainerTextLogin>
          <TitleLogin>Entrar</TitleLogin>
          <LoginMessage>Entre com sua conta</LoginMessage>
        </ContainerTextLogin>

        <Form onFinish={handleSubmit(onSubmitLogin)} layout="vertical" style={{ width: "100%", maxWidth: 270, height: "207px" }} requiredMark={false} aria-describedby="login-form-description">
          <Controller
            name="email"
            control={control}
            rules={{ required: "Email obrigatório" }}
            render={({ field }) => (
              <Form.Item label="Email" validateStatus={errors.email ? "error" : ""} help={errors.email?.message} hasFeedback htmlFor="email">
                <Input id="email" prefix={<UserOutlined />} placeholder="Digite seu email" {...field} autoComplete="email" aria-required="true" />
              </Form.Item>
            )}
          />

          <Controller
            name="password"
            control={control}
            rules={{ required: "Senha obrigatória" }}
            render={({ field }) => (
              <Form.Item label="Senha" validateStatus={errors.password ? "error" : ""} help={errors.password?.message} hasFeedback htmlFor="password">
                <Input.Password id="password" prefix={<LockOutlined />} placeholder="Digite sua senha" {...field} autoComplete="current-password" aria-required="true" />
              </Form.Item>
            )}
          />

          <Form.Item>
            <Button type="primary" htmlType="submit" block aria-label="Entrar" loading={loading}>
              Entrar
            </Button>
          </Form.Item>
        </Form>

        <ForgotPasswordText tabIndex={0} onClick={alternateForgotPassword}>
          Esqueceu a senha?
        </ForgotPasswordText>
      </ContainerLogin>

      <BackDrop onClick={alternateForgotPassword} $isOpenForgotPassword={isForgotPasswordOpen}></BackDrop>

      <ContainerForgotPassword $isOpenForgotPassword={isForgotPasswordOpen}>
        <ButtonClose type="text" icon={<CloseOutlined />} aria-label="Fechar" onClick={alternateForgotPassword}></ButtonClose>

        <Logo src={Isologo} alt="Logo da aplicação" />

        <ContainerTextLogin>
          <TitleLogin>Recuperação de senha</TitleLogin>
          <LoginMessage>Digite seu email para recuperar sua senha</LoginMessage>
        </ContainerTextLogin>

        <Form
          onFinish={handleSubmit(onSubmitForgotPassword)}
          layout="vertical"
          style={{ width: "100%", maxWidth: 270, height: "140px" }}
          requiredMark={false}
          aria-describedby="login-form-description"
        >
          <Controller
            name="email"
            control={control}
            rules={{ required: "Email obrigatório" }}
            render={({ field }) => (
              <Form.Item label="Email" validateStatus={errors.email ? "error" : ""} help={errors.email?.message} hasFeedback htmlFor="email">
                <Input id="emailPassword" prefix={<UserOutlined />} placeholder="Digite seu email" {...field} autoComplete="email" aria-required="true" />
              </Form.Item>
            )}
          />

          <Form.Item>
            <Button type="primary" htmlType="submit" block aria-label="Enviar">
              Enviar
            </Button>
          </Form.Item>
        </Form>
      </ContainerForgotPassword>
    </ContainerPageLogin>
  );
};

export default Login;
