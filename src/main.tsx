import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { LangProvider } from "./i18n";
import damask from "./assets/obsidian-damask.jpg";
import silk from "./assets/ivory-silk.jpg";

// Register the paper textures once as CSS variables (inlined by the single-file build).
const root = document.documentElement;
root.style.setProperty("--tex-damask", `url("${damask}")`);
root.style.setProperty("--tex-silk", `url("${silk}")`);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LangProvider>
      <App />
    </LangProvider>
  </StrictMode>
);
