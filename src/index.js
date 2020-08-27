import React from "react";
import ReactDOM from "react-dom";
import "./css/normalize.css";
import "./css/index.css";
import App from "./App";
import Toast from './assets/toast.svg'

const loader = document.createElement("img");
loader.src= Toast;
loader.className='loading';
loader.id='loader';
document.body.insertAdjacentElement('afterbegin', loader);

const showLoader = () => loader.classList.remove("loader--hide");

const hideLoader = () => loader.classList.add("loader--hide");

ReactDOM.render(
  <React.StrictMode>
    <App hideLoader={hideLoader} showLoader={showLoader} />
  </React.StrictMode>,
  document.getElementById("root")
);
