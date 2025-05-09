import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { Provider } from "react-redux";
// import store, { persistor } from "./redux/store";
import store, { persistor } from "./redux_toolkit/store"; // Import the store and persistor from redux_toolkit/store.js
import { PersistGate } from "redux-persist/integration/react";
import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery.min.js";
import "popper.js/dist/umd/popper.min.js";
import "bootstrap/dist/js/bootstrap.min.js";

import "font-awesome/css/font-awesome.min.css";

import "bootstrap-icons/font/bootstrap-icons.css";

//Toastify message
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ToastContainer position="bottom-right" autoClose={2000} />
      <App />
    </PersistGate>

  </Provider>
);
reportWebVitals();
