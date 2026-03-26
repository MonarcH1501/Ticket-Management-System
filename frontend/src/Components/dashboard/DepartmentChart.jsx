import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme
} from "@mui/material";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

export default function DepartmentChart({ data }) {
  const theme = useTheme();
  
  if (!data || data.length === 0) {
    return (
      <Card sx={{ width: "100%" }}>
        <CardContent>
          <Typography sx={{ mb: 2, fontWeight: 600 }}>
            Tickets by Department
          </Typography>
          <Typography color="text.secondary" align="center">
            No data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const hasMultiple = data.length > 1;
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.info.main,
    theme.palette.warning.main,
    theme.palette.error.main
  ];

  const formattedData = data.map(item => ({
    ...item,
    name: item.department?.name || item.name || "Unknown Department",
    total: item.total || 0
  }));

  return (
    <Card sx={{ width: "100%" }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Tickets by Department
        </Typography>

        <Box sx={{ height: 280, width: "100%" }}> {/* Kurangi height dari 350 ke 280 */}
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={formattedData}
                dataKey="total"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={hasMultiple ? 50 : 0} // Kurangi dari 70 ke 50
                outerRadius={90} // Kurangi dari 120 ke 90
                paddingAngle={hasMultiple ? 2 : 0}
                stroke="none" // Hilangkan stroke
                strokeWidth={0}
              >
                {formattedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="none" // Pastikan tidak ada stroke
                    strokeWidth={0}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`${value} tickets`, name]}
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: '4px'
                }}
              />
              <Legend 
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{
                  fontSize: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}