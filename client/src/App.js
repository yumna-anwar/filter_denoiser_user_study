import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { store } from "./Store/Store";
import Loading from "./Screens/Loading";

const App = () => {
  return (
    <Provider store={store}>
      <Loading />
    </Provider>
  );
};

export default App;
