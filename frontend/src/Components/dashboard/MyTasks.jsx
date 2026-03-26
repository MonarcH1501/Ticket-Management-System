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
    if (s === "in_progress") return "info.main"
    if (s === "completed") return "success.main"
    return "warning.main"
  }

  return (
    <Box sx={{ display: "flex", gap: 2, overflowX: "auto" }}>

      {columns.map((col, i) => (
        <Box key={i} sx={{ minWidth: 300 }}>

          <Typography
            sx={{
              mb: 2,
              fontWeight: 600,
              fontSize: 13,
              color: "text.secondary"
            }}
          >
            {col.title} ({col.items.length})
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

            {col.items.map(task => (
              <Paper
                key={task.id}
                onClick={() => navigate(`/tickets/${task.id}`)}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  cursor: "pointer",
                  bgcolor: "background.paper",
                  transition: "0.2s",
                  "&:hover": {
                    transform: "translateY(-3px)"
                  }
                }}
              >

                <Typography fontSize={12} color="text.secondary">
                  {task.ticket_code}
                </Typography>

                <Typography fontWeight={600} fontSize={14} sx={{ mb: 1 }}>
                  {task.title}
                </Typography>

                <Chip
                  label={task.current_status}
                  size="small"
                  sx={{
                    bgcolor: getColor(task.current_status),
                    color: "#fff"
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