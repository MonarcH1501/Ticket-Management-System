import {
  Card,
  CardContent,
  Typography,
  Box
} from "@mui/material";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from "recharts";

const COLORS = [
  "#6366f1",
  "#22c55e",
  "#06b6d4",
  "#f59e0b",
  "#ef4444"
];

export default function DepartmentChart({ data }) {

  return (

    <Card
      sx={{
        borderRadius: 3,
        background: "#1e293b",
        color: "white",
        width: "100%"
      }}
    >

      <CardContent>

        <Typography sx={{ mb: 2 }}>
          Tickets by Department
        </Typography>

        <Box sx={{ height: 260, width:"100%" }}>

          <ResponsiveContainer width="100%" height="100%">

            <PieChart>

              <Pie
                data={data}
                dataKey="total"
                nameKey="department.name"
                outerRadius={90}
              >

                {data.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </Box>

      </CardContent>

    </Card>

  );

}