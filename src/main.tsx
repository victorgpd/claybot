import "./styles/index.css";
import App from "./App.tsx";
import store from "./redux/store.ts";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("./service-worker.js");
    } catch (err) {
      console.error("Falha ao registrar SW:", err);
    }
  });
}

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
