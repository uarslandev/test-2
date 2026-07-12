import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./i18n/config.ts";
import "./styles/index.css";

console.log("Main.tsx loaded");

const root = createRoot(document.getElementById("root")!);

root.render(<App />);

console.log("App rendered");
