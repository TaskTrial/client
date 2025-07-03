import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./Components/store/store.js";
import { GoogleAuthProvider } from "./Components/google/GoogleAuthContext";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
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
