import { Routes, Route } from "react-router-dom";
import "./App.css";
import SignUp from "./Components/SignUp";
import SignIn from "./Components/SignIn";
import NotFound from "./Components/NotFound";
import Home from "./Components/Home";
import ProtectedRoute from "./ProtectedRoute";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="*" element={<NotFound />} />
        <Route
          path="/Home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
