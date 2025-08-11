import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { RoutesEnum } from "../enums/enums";
import Login from "../pages/Login";
import Screen from "../components/Screen";
import Home from "../pages/Home";

export const screensRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Screen />,
    errorElement: <div>404</div>,
    children: [
      {
        index: true,
        element: <Navigate to={RoutesEnum.Home} replace />,
      },
      {
        path: RoutesEnum.Login,
        element: <Login />,
      },
    ],
  },
];

export const loggedScreensRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Screen />,
    children: [
      {
        path: RoutesEnum.Home,
        element: <Home />,
      },
    ],
  },
];
