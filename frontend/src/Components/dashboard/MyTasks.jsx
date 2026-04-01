import {
  Box,
  Typography,
  Paper,
  Chip
} from "@mui/material"
import { useNavigate } from "react-router-dom"

export default function MyTasks({ data }) {

  const navigate = useNavigate()

  const columns = [
    { title: "TO DO", items: data?.todo ?? [] },
    { title: "IN PROGRESS", items: data?.in_progress ?? [] },
    { title: "DONE", items: data?.done ?? [] }
  ]

  const getColor = (status) => {
    const s = status?.toLowerCase()

    if (s === "in_progress") return "#38bdf8"
    if (s === "completed" || s === "closed") return "#22c55e"
    return "#f59e0b"
  }

  const formatStatus = (status) => {
    return status?.replaceAll("_", " ")
  }

  return (

    <Box
      sx={{
        display: "flex",
        gap: 2,
        overflowX: "auto",
        pb: 2
      }}
    >

      {columns.map((col, i) => (

        <Box
          key={i}
          sx={{
            minWidth: 300,
            flex: 1
          }}
        >

          {/* HEADER */}
          <Typography
            sx={{
              fontWeight: "bold",
              mb: 1.5,
              fontSize: 14,
              color: "#64748b"
            }}
          >
            {col.title} ({col.items.length})
          </Typography>

          {/* LIST */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>

            {col.items.length === 0 && (
              <Typography fontSize={12} color="text.secondary">
                No tasks
              </Typography>
            )}

            {col.items.map(task => (

              <Paper
                key={task.id}
                elevation={2}
                onClick={() => navigate(`/tickets/${task.id}`)}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  cursor: "pointer",
                  transition: "0.2s",
                  background: "#ffffff",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: 4
                  }
                }}
              >

                <Typography fontSize={12} color="#94a3b8">
                  {task.ticket_code}
                </Typography>

                <Typography fontWeight="bold" fontSize={14} sx={{ mb: 1 }}>
                  {task.title}
                </Typography>

                <Chip
                  label={formatStatus(task.current_status)}
                  size="small"
                  sx={{
                    background: getColor(task.current_status),
                    color: "white",
                    fontSize: 11
                  }}
                />

              </Paper>

            ))}

          </Box>

        </Box>

      ))}

    </Box>
  )
}