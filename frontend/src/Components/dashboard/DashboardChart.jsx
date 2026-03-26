import { Card, CardContent, Typography, Box } from "@mui/material";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

export default function DashboardChart({ data }) {

  return (
    <Card sx={{ width: "100%" }}>

      <CardContent>

        <Typography sx={{ mb: 2, fontWeight: 600 }}>
          Ticket Activity
        </Typography>

        <Box sx={{ height: 320 }}>

          <ResponsiveContainer width="100%" height="100%">

            <BarChart data={data}>

              <XAxis dataKey="date" />
              <YAxis />

              <Tooltip />

              <Bar dataKey="created" fill="#6366f1" />
              <Bar dataKey="completed" fill="#22c55e" />

            </BarChart>

          </ResponsiveContainer>

        </Box>

      </CardContent>

    </Card>
  );
}