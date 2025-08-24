import { notification } from "antd";
import { createContext } from "react";
import type { NotificationArgsProps } from "antd";

// eslint-disable-next-line react-refresh/only-export-components
export const NotificationContext = createContext<{
  notify: {
    show: (config: NotificationArgsProps) => void;
    success: (message: string, description?: string) => void;
    error: (message: string, description?: string) => void;
    info: (message: string, description?: string) => void;
    warning: (message: string, description?: string) => void;
  };
} | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();

  const notify = {
    show: (config: NotificationArgsProps) => api.open({ placement: "topRight", duration: 5, showProgress: true, ...config }),
    success: (message: string, description?: string) => api.success({ message, description, placement: "topRight", duration: 3, showProgress: true }),
    error: (message: string, description?: string) => api.error({ message, description, placement: "topRight", duration: 3, showProgress: true }),
    info: (message: string, description?: string) => api.info({ message, description, placement: "topRight", duration: 3, showProgress: true }),
    warning: (message: string, description?: string) => api.warning({ message, description, placement: "topRight", duration: 3, showProgress: true }),
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};
