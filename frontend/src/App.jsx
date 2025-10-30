import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DocumentCreate from "./pages/DocumentCreate";
import ProtectedRoute from "./components/ProtectedRoute";
import SparepartList from "./pages/SparepartList";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
// import SpisView from "./components/spisDoc/SpisView";
import DocumentView from "./pages/DocumentView";

export default function App() {
  const isLoggedIn = !!localStorage.getItem("token"); 
  const userRole = localStorage.getItem("role")?.trim();

  return (
    <BrowserRouter>
      <Routes>
        {/* 🔹 Default route "/" */}
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          }
        />

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
            userRole === "admin" ? (
              <ProtectedRoute>
                <DocumentCreate />
              </ProtectedRoute>
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        <Route
          path="/sparepart-list"
          element={
            <ProtectedRoute>
              <SparepartList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        {/* <Route 
          path="/document/view/:doc_no" 
          element={
            <ProtectedRoute>
              <SpisView />
            </ProtectedRoute>
          } 
        /> */}
        <Route 
          path="/document/view/:type/:doc_no" 
          element={
            <ProtectedRoute>
              <DocumentView />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}