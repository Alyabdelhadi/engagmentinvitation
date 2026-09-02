import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Scene } from "./App";
import "./shaders/threeui.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Scene />
  </StrictMode>
);
