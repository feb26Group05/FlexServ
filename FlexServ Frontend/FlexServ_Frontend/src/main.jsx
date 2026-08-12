import React from "react";
import ReactDOM from "react-dom/client";
import './index.css';
import App from './App.jsx';

import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { ToastProvider } from "./components/Toast/ToastContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </Provider>
  </React.StrictMode>
);
