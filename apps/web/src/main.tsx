import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import "./styles.css";

// Find the HTML div where React should render the app.
const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container was not found");
}

// Start the React app.
createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
