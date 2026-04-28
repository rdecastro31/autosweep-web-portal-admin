import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

// pages
import Home from "./pages/dashboard/Home";
import MainAccounts from "./pages/dashboard/MainAccounts";
import SubAccounts from "./pages/dashboard/SubAccounts";
import Tickets from "./pages/dashboard/Tickets";
import SearchTicket from "./pages/dashboard/SearchTicket";
import AMS from "./pages/dashboard/AMS";
import Users from "./pages/dashboard/Users";



import "./App.css";

function App() {
  return (
    <BrowserRouter basename="/WebAdmin">
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Administrator", "System User", "Mancom"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="main-accounts" element={<MainAccounts />} />
          <Route path="sub-accounts" element={<SubAccounts />} />
          <Route path="ams" element={<AMS />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="search-ticket" element={<SearchTicket />} />

          <Route
            path="users"
            element={
              <ProtectedRoute allowedRoles={["Administrator"]}>
                <Users />
              </ProtectedRoute>
            }
          />

       

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;