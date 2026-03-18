import { NavLink } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../context/auth-context"
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from "@mui/material"

import DashboardIcon from "@mui/icons-material/Dashboard"
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber"
import AddIcon from "@mui/icons-material/Add"
import LogoutIcon from "@mui/icons-material/Logout"

export default function Sidebar({ collapsed, drawerWidth }) {

  const { logout } = useContext(AuthContext)

  const activeStyle = {
    background: "#6366f1",
    color: "white",
    borderRadius: 2,
    boxShadow: "0 4px 12px rgba(99,102,241,0.4)"
  }

  const menus = [
    {
      label: "Dashboard",
      path: "/",
      icon: <DashboardIcon />
    },
    {
      label: "All Tickets",
      path: "/tickets/alltickets",
      icon: <ConfirmationNumberIcon />
    },
    {
      label: "Create Ticket",
      path: "/tickets/create",
      icon: <AddIcon />
    }
  ]

  return (

    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          background: "#020617",
          color: "white",
          boxSizing: "border-box",
          transition: "all .3s ease"
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

        {menus.map(menu => (

          <NavLink
            key={menu.path}
            to={menu.path}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {({ isActive }) => (

              <ListItemButton
                sx={{
                  ...(isActive ? activeStyle : {}),
                  transition: "all 0.2s",
                  "&:hover": {
                    background: "#1e293b"
                  }
                }}
              >

                <ListItemIcon sx={{ color: "white" }}>
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
        <ListItemButton onClick={logout} sx={{ mt: 2 }}>

          <ListItemIcon sx={{ color: "white" }}>
            <LogoutIcon />
          </ListItemIcon>

          {!collapsed && (
            <ListItemText primary="Logout" />
          )}

        </ListItemButton>

      </List>

    </Drawer>

  )
}