import {
  Typography,
  Box,
  Chip,
  Button
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function RecentTickets({ tickets }) {

  const navigate = useNavigate();

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === "in_progress") return "info";
    if (s === "completed") return "success";
    return "warning";
  };

  return (
    <Box>

      <Typography sx={{ mb: 2, fontWeight: 600 }}>
        Recent Tickets
      </Typography>

      {tickets.map((ticket, index) => (

        <Box
          key={ticket.id}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 1.5,
            px: 2,

            borderBottom: index !== tickets.length - 1 ? "1px solid" : "none",
            borderColor: "divider",

            transition: "0.2s",
            "&:hover": {
              bgcolor: "background.default"
            }
          }}
        >

          {/* LEFT */}
          <Box>
            <Typography fontWeight={600}>
              {ticket.ticket_code}
            </Typography>

            <Typography fontSize={13} color="text.secondary">
              {ticket.title}
            </Typography>
          </Box>

          {/* RIGHT */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>

            <Chip
              label={ticket.current_status}
              size="small"
              color={getStatusColor(ticket.current_status)}
            />

            <Button
              size="small"
              variant="contained"
              onClick={() => navigate(`/tickets/${ticket.id}`)}
            >
              View
            </Button>

          </Box>

        </Box>

      ))}

    </Box>
  );
}