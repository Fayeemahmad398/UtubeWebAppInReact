import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import MyContext from "./myContext/MyContext";

ReactDOM.render(
  <MyContext>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </MyContext>,
  document.getElementById("root")
);
