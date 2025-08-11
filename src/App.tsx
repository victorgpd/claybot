import { loggedScreensRoutes, screensRoutes } from "./app/routes";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { NotificationProvider } from "./context/notificationContext";

function App() {
  const router = createBrowserRouter([...screensRoutes, ...loggedScreensRoutes]);

  return (
    <NotificationProvider>
      <RouterProvider router={router} />
    </NotificationProvider>
  );
}

export default App;
