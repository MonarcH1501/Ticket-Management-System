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
  Typography,
  Box,
  IconButton
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";

export default function Sidebar({ collapsed, setCollapsed, drawerWidth }) {
  const { logout } = useContext(AuthContext);

  const menus = [
    { label: "Dashboard", path: "/", icon: <DashboardIcon /> },
    { label: "All Tickets", path: "/tickets/alltickets", icon: <ConfirmationNumberIcon /> },
    { label: "Create Ticket", path: "/tickets/create", icon: <AddIcon /> }
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          transition: "all 0.3s ease",
          overflowX: "hidden",
          background: "linear-gradient(180deg,#0f172a,#1e293b)",
          color: "#fff",
          borderRight: "none"
        }
      }}
    >
      {/* HEADER */}
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: collapsed ? "center" : "space-between",
          px: 2
        }}
      >
        {!collapsed && (
          <Typography variant="h6" fontWeight={600}>
            Ticketing
          </Typography>
        )}

        <IconButton onClick={() => setCollapsed(!collapsed)} sx={{ color: "#fff" }}>
          {collapsed ? <MenuIcon /> : <MenuOpenIcon />}
        </IconButton>
      </Toolbar>

      {/* MENU */}
      <List sx={{ px: 1 }}>

        {menus.map(menu => (
          <NavLink
            key={menu.path}
            to={menu.path}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {({ isActive }) => (
              <ListItemButton
                sx={{
                  mb: 1,
                  borderRadius: 3,
                  px: 2,
                  py: 1.2,
                  ...(isActive && {
                    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                    boxShadow: "0 6px 20px rgba(99,102,241,0.4)"
                  }),
                  "&:hover": {
                    background: "rgba(255,255,255,0.08)",
                    transform: "translateX(4px)"
                  }
                }}
              >
                <ListItemIcon sx={{ color: "#fff", minWidth: 0, mr: collapsed ? 0 : 2 }}>
                  {menu.icon}
                </ListItemIcon>

                {!collapsed && (
                  <ListItemText primary={menu.label} />
                )}
              </ListItemButton>
            )}
          </NavLink>
        ))}

        {/* LOGOUT */}
        <ListItemButton
          onClick={logout}
          sx={{
            mt: 2,
            borderRadius: 3,
            px: 2,
            "&:hover": {
              background: "rgba(255,0,0,0.2)"
            }
          }}
        >
          <ListItemIcon sx={{ color: "#fff", minWidth: 0, mr: collapsed ? 0 : 2 }}>
            <LogoutIcon />
          </ListItemIcon>

          {!collapsed && <ListItemText primary="Logout" />}
        </ListItemButton>

      </List>
    </Drawer>
  );
}