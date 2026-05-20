import { NavLink } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../context/auth-context"

import {
  Drawer, List, ListItemButton, ListItemIcon,
  ListItemText, Toolbar, Typography, IconButton, Tooltip
} from "@mui/material"

import DashboardIcon          from "@mui/icons-material/Dashboard"
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber"
import AddIcon                from "@mui/icons-material/Add"
import LogoutIcon             from "@mui/icons-material/Logout"
import MenuOpenIcon           from "@mui/icons-material/MenuOpen"
import MenuIcon               from "@mui/icons-material/Menu"
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings"

import {
  PRIMARY, PRIMARY_BORDER, GRADIENT_SIDEBAR
} from "../theme/colors"

export default function Sidebar({ collapsed, setCollapsed, drawerWidth }) {
  const { logout, user } = useContext(AuthContext)
  const isAdmin = user?.roles?.some(r => ['admin', 'superadmin'].includes(r.name))

  const menus = [
    { label: "Dashboard",     path: "/",                   icon: <DashboardIcon /> },
    { label: "All Tickets",   path: "/tickets/alltickets", icon: <ConfirmationNumberIcon /> },
    { label: "Create Ticket", path: "/tickets/create",     icon: <AddIcon /> },
    ...(isAdmin ? [{ label: "Admin", path: "/admin", icon: <AdminPanelSettingsIcon /> }] : [])
  ]

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        borderRight: "none",
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          transition: "all 0.3s ease",
          overflowX: "hidden",
          background: GRADIENT_SIDEBAR,
          color: "#fff",
          borderRight: "none",
          boxShadow: "none"
        }
      }}
    >
      {/* Header */}
      <Toolbar sx={{ display: "flex", justifyContent: collapsed ? "center" : "space-between", px: 2 }}>
        {!collapsed && (
          <Typography variant="h6" fontWeight={700} sx={{ color: "#fff", letterSpacing: ".01em" }}>
            Ticketing
          </Typography>
        )}
        <IconButton onClick={() => setCollapsed(!collapsed)} sx={{ color: PRIMARY_BORDER }}>
          {collapsed ? <MenuIcon /> : <MenuOpenIcon />}
        </IconButton>
      </Toolbar>

      {/* Menu */}
      <List sx={{ px: 1 }}>
        {menus.map(menu => (
          <NavLink key={menu.path} to={menu.path} style={{ textDecoration: "none", color: "inherit" }}>
            {({ isActive }) => (
              <Tooltip
                title={collapsed ? menu.label : ""}
                placement="right"
                arrow
              >
                <ListItemButton
                  sx={{
                    mb: 0.5,
                    borderRadius: 3,
                    px: 2,
                    py: 1.2,
                    justifyContent: collapsed ? "center" : "flex-start",
                    color: isActive ? "#fff" : PRIMARY_BORDER,
                    ...(isActive && {
                      background: PRIMARY,
                      boxShadow: `0 4px 14px rgba(30,64,175,0.4)`
                    }),
                    "&:hover": {
                      background: "rgba(255,255,255,0.1)",
                      color: "#fff",
                      transform: "translateX(3px)"
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit", minWidth: 0, mr: collapsed ? 0 : 2 }}>
                    {menu.icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={menu.label}
                      primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            )}
          </NavLink>
        ))}

        {/* Logout */}
        <Tooltip title={collapsed ? "Logout" : ""} placement="right" arrow>
          <ListItemButton
            onClick={logout}
            sx={{
              mt: 2, borderRadius: 3, px: 2, py: 1.2,
              justifyContent: collapsed ? "center" : "flex-start",
              color: PRIMARY_BORDER,
              "&:hover": { background: "rgba(239,68,68,0.2)", color: "#fca5a5" }
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 0, mr: collapsed ? 0 : 2 }}>
              <LogoutIcon />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </List>
    </Drawer>
  )
}