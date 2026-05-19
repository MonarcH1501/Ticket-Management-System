import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import LoginForm from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Template from "../layouts/Template";
import TicketList from "../pages/TicketList";
import CreateTicket from "../pages/CreateTicket";
import TicketDetail from "../pages/TicketDetail";
import Admin from "../pages/Admin";
import GoogleCallback from "../Components/GoogleCallback";
import { NotFound, Forbidden, ServerError } from "../pages/ErrorPages"; // ✅

export default function AppRoutes() {
  return (
    <Routes>

      {/* Public */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/login/google/callback" element={<GoogleCallback />} />
      <Route path="/403" element={<Forbidden />} />
      <Route path="/500" element={<ServerError />} />

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Template />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tickets/alltickets" element={<TicketList />} />
          <Route path="/tickets/create" element={<CreateTicket />} />
          <Route path="/tickets/:id" element={<TicketDetail />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Route>

      {/* 404 — harus paling bawah */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}