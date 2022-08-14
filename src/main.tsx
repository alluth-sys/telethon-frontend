import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Redux
import { store } from "./app/store";
import { Provider } from "react-redux";

// Socket Context
import { SocketContext, socket } from "@/service/Socket";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <SocketContext.Provider value={socket}>
    <Provider store={store}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>
  </SocketContext.Provider>
);
