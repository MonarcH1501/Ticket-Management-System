import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Badge,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography
} from "@mui/material"
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone"
import DoneAllIcon from "@mui/icons-material/DoneAll"
import api from "../api/axios"

export default function NotificationBell() {
  const [anchorEl, setAnchorEl] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const timerRef = useRef(null)
  const navigate = useNavigate()
  const open = Boolean(anchorEl)

  const loadNotifications = async () => {
    try {
      const res = await api.get("/notifications/unread")
      setItems(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
    timerRef.current = window.setInterval(loadNotifications, 30000)

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [])

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget)
    loadNotifications()
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const openNotification = async (notification) => {
    try {
      await api.post(`/notifications/${notification.id}/read`)
    } catch (err) {
      console.error(err)
    }

    handleClose()
    navigate(notification.data?.url || "/")
    loadNotifications()
  }

  const markAllAsRead = async () => {
    try {
      await api.post("/notifications/read-all")
      setItems([])
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton onClick={handleOpen} size="small" sx={{ mr: 1 }}>
          <Badge badgeContent={items.length} color="error" max={99}>
            <NotificationsNoneIcon sx={{ color: "#0c4a6e" }} />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          sx: {
            mt: 1.5,
            width: 340,
            maxHeight: 420,
            borderRadius: 2,
            overflow: "hidden"
          }
        }}
      >
        <Box sx={{ px: 2, py: 1.25, display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
              Notifications
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {items.length} unread
            </Typography>
          </Box>

          {items.length > 0 && (
            <Tooltip title="Mark all as read">
              <IconButton size="small" onClick={markAllAsRead}>
                <DoneAllIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider />

        {loading ? (
          <Box sx={{ py: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
            <CircularProgress size={24} />
            <Typography variant="caption" color="text.secondary">
              Loading notifications...
            </Typography>
          </Box>
        ) : items.length === 0 ? (
          <Box sx={{ px: 2, py: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No new notifications
            </Typography>
          </Box>
        ) : (
          items.map((item) => (
            <MenuItem
              key={item.id}
              onClick={() => openNotification(item)}
              sx={{
                alignItems: "flex-start",
                whiteSpace: "normal",
                py: 1.25,
                borderBottom: "1px solid #e0f2fe"
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "#0f172a" }}>
                  {item.data?.message || "Notification"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  #{item.data?.ticket_code} - {item.data?.title}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  )
}
