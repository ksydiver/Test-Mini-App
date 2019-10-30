import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import * as connect from "@vkontakte/vk-connect";

connect.send("VKWebAppInit");
connect.send("VKWebAppGetUserInfo");

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
