import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import LoginForm from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Template from "../layouts/Template";
import TicketList from "../pages/TicketList";
import CreateTicket from "../pages/CreateTicket";

export default function AppRoutes() {
  return (
    <Routes>

      {/* Public */}
      <Route path="/login" element={<LoginForm />} />

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Template />}>

          <Route path="/" element={<Dashboard />} />
          <Route path="/tickets/alltickets" element={<TicketList />} />
          <Route path="/tickets/create" element={<CreateTicket />} />
        </Route>
      </Route>

    </Routes>
  );
}