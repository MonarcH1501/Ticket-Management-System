import {
  Typography,
  Box,
  Chip
} from "@mui/material";

import DashboardCard from "./DashboardCard";

export default function MyTasks({ tasks }) {

  const getColor = (status) => {

    if(status === "IN_PROGRESS") return "#38bdf8";
    if(status === "COMPLETED") return "#22c55e";

    return "#f59e0b";

  }

  return (

    <DashboardCard>

      <Typography sx={{ mb: 2 }}>
        My Tasks
      </Typography>

      {tasks.map(task => (

        <Box
          key={task.id}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems:"center",
            py: 1.5,
            px:1,
            borderBottom: "1px solid #334155",
            borderRadius:1,
            transition:"0.2s",
            "&:hover":{ background:"#334155" }
          }}
        >

          <Box>

            <Typography>
              {task.ticket_code}
            </Typography>

            <Typography
              sx={{
                fontSize: 12,
                color: "#94a3b8"
              }}
            >
              {task.title}
            </Typography>

          </Box>

          <Chip
            label={task.current_status}
            size="small"
            sx={{
              background:getColor(task.current_status),
              color:"white"
            }}
          />

        </Box>

      ))}

    </DashboardCard>

  );

}