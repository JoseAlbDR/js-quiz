import React from "react";
import ReactDOM from "react-dom/client";
import "prismjs/themes/prism-okaidia.css";
import "./styles/index.css";
import App from "./components/App";
import { QuizProvider } from "./context/QuizContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QuizProvider>
      <App />
    </QuizProvider>
  </React.StrictMode>
);
