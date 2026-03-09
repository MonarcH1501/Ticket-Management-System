import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth-context";

import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout"; // Import ikon logout

const drawerWidth = 220;

export default function Sidebar({ collapsed }) {
  const { logout } = useContext(AuthContext); // Ambil fungsi logout dari context

  const activeStyle = {
    background: "#6366f1",
    color: "white",
    borderRadius: 2
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          background: "#020617", // Warna latar belakang sidebar
          color: "white",
          boxSizing: "border-box",
          transition: "all .2s"
        }
      }}
    >
      {/* LOGO */}
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: collapsed ? "center" : "flex-start"
        }}
      >
        {!collapsed && (
          <Typography variant="h6">
            Ticketing
          </Typography>
        )}
      </Toolbar>

      <List>
        {/* DASHBOARD */}
        <NavLink to="/" style={{ textDecoration: "none", color: "inherit" }}>
          {({ isActive }) => (
            <ListItemButton sx={isActive ? activeStyle : {}}>
              <ListItemIcon sx={{ color: "white" }}>
                <DashboardIcon />
              </ListItemIcon>
              {!collapsed && <ListItemText primary="Dashboard" />}
            </ListItemButton>
          )}
        </NavLink>

        {/* ALL TICKETS */}
        <NavLink
          to="/tickets/alltickets"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {({ isActive }) => (
            <ListItemButton sx={isActive ? activeStyle : {}}>
              <ListItemIcon sx={{ color: "white" }}>
                <ConfirmationNumberIcon />
              </ListItemIcon>
              {!collapsed && <ListItemText primary="All Tickets" />}
            </ListItemButton>
          )}
        </NavLink>

        {/* CREATE TICKET */}
        <NavLink
          to="/tickets/create"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {({ isActive }) => (
            <ListItemButton sx={isActive ? activeStyle : {}}>
              <ListItemIcon sx={{ color: "white" }}>
                <AddIcon />
              </ListItemIcon>
              {!collapsed && <ListItemText primary="Create Ticket" />}
            </ListItemButton>
          )}
        </NavLink>

        {/* LOGOUT */}
        <ListItemButton onClick={logout} sx={{ mt: 2 }}>
          <ListItemIcon sx={{ color: "white" }}>
            <LogoutIcon /> {/* Ikon logout */}
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Logout" />}
        </ListItemButton>
      </List>
    </Drawer>
  );
}