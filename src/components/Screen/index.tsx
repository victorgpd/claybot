import Isologo from "../../assets/isologo.png";

import { Button, Spin } from "antd";
import { useEffect, useState } from "react";
import { auth } from "../../services/firebase";
import { ContainerPage, Header, Main } from "./styles";
import { RoutesEnum } from "../../enums/enums";
import { onAuthStateChanged } from "firebase/auth";
import { useAppDispatch } from "../../redux/hooks";
import { LoadingOutlined, LogoutOutlined } from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import { clearUser, setUser } from "../../redux/globalReducer/slice";
import { useAuth } from "../../hooks/useAuth";

const Screen = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { logout } = useAuth(navigate);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const currentPath = location.pathname;
      const isOnLoginPage = currentPath === "/login";
      const isOnPainel = currentPath !== "/login";

      if (user) {
        dispatch(
          setUser({
            uid: user.uid,
            email: user.email ?? "",
          })
        );

        if (isOnLoginPage) {
          navigate(RoutesEnum.Home, { replace: true });
        }
      } else {
        dispatch(clearUser());

        if (isOnPainel) {
          navigate(RoutesEnum.Login, { replace: true });
        }
      }
    });
    setLoading(false);

    return () => unsubscribe();
  }, [location.pathname]);

  return (
    <>
      <Header>
        <img src={Isologo} alt="Logo da aplicação" />

        <Button type="text" variant="text" color="danger" icon={<LogoutOutlined />} onClick={logout}>
          Sair
        </Button>
      </Header>

      <Main>
        {loading ? (
          <ContainerPage>
            <Spin indicator={<LoadingOutlined />} size="large" />
          </ContainerPage>
        ) : (
          <Outlet />
        )}
      </Main>
    </>
  );
};

export default Screen;
