import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./Components/store/store.js";
import { GoogleAuthProvider } from "./Components/google/GoogleAuthContext";

// Get the Google client ID from environment variables
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Check if client ID is available
if (!clientId) {
  console.warn(
    "VITE_GOOGLE_CLIENT_ID is not defined in your environment variables. Google authentication will not work."
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <GoogleAuthProvider clientId={clientId}>
          <App />
        </GoogleAuthProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
