import {
  Typography,
  Box,
  Chip
} from "@mui/material";

import DashboardCard from "./DashboardCard";

export default function RecentTickets({ tickets }) {

  return (

    <DashboardCard>

      <Typography sx={{ mb: 2 }}>
        Recent Tickets
      </Typography>

      {tickets.map(ticket => (

        <Box
          key={ticket.id}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems:"center",
            py: 1.5,
            px: 1,
            borderBottom: "1px solid #334155",
            borderRadius:1,
            transition:"0.2s",
            "&:hover":{ background:"#334155" }
          }}
        >

          <Box>

            <Typography>
              {ticket.ticket_code}
            </Typography>

            <Typography
              sx={{
                fontSize: 12,
                color: "#94a3b8"
              }}
            >
              {ticket.title}
            </Typography>

          </Box>

          <Chip
            label={ticket.current_status}
            size="small"
            sx={{
              background:"#334155",
              color:"white"
            }}
          />

        </Box>

      ))}

    </DashboardCard>

  );

}