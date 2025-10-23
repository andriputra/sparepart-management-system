import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DocumentCreate from "./pages/DocumentCreate";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/document-create"
          element={
            <ProtectedRoute>
                <DocumentCreate />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}