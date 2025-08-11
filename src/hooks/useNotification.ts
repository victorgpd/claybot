import { useContext } from "react";
import { NotificationContext } from "../context/notificationContext";

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotify must be used within a NotificationProvider");
  return context.notify;
};
