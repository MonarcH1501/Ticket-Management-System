import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme
} from "@mui/material";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";

// CustomTooltip di luar komponen
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          p: 1,
          boxShadow: 1
        }}
      >
        <Typography variant="body2" fontWeight="bold">
          {payload[0].name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tickets: {payload[0].value}
        </Typography>
      </Box>
    );
  }
  return null;
};

export default function StatusChart({ data }) {
  const theme = useTheme();

  console.log("StatusChart data:", data); // Debug log

  if (!data || data.length === 0) {
    return (
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Typography sx={{ mb: 2, fontWeight: 600 }}>
            Tickets by Status
          </Typography>
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            No data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.warning.main,
    theme.palette.success.main,
    theme.palette.error.main,
    theme.palette.info.main
  ];

  // Format data dengan benar
  const formattedData = data.map((item, index) => {
    let name = "";
    if (item.current_status) {
      name = item.current_status.replace(/_/g, " ");
    } else if (item.status) {
      name = item.status.replace(/_/g, " ");
    } else if (item.name) {
      name = item.name;
    } else {
      name = "Unknown";
    }
    
    return {
      id: index,
      name: name,
      total: item.total || item.count || 0
    };
  });

  // Filter out items with total 0
  const filteredData = formattedData.filter(item => item.total > 0);

  if (filteredData.length === 0) {
    return (
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Typography sx={{ mb: 2, fontWeight: 600 }}>
            Tickets by Status
          </Typography>
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            No data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: "auto" }}>
      <CardContent>
        <Typography sx={{ mb: 2, fontWeight: 600 }}>
          Tickets by Status
        </Typography>

        <Box sx={{ height: 280, width: "auto" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={filteredData}
                dataKey="total"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
                stroke="none"
                strokeWidth={0}
                isAnimationActive={false}
              >
                {filteredData.map((entry, i) => (
                  <Cell 
                    key={entry.id} 
                    fill={COLORS[i % COLORS.length]} 
                    stroke="none"
                    strokeWidth={0}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom"
                align="center"
                height={36}
                wrapperStyle={{
                  fontSize: '12px',
                  paddingTop: '10px'
                }}
                iconType="circle"
                iconSize={8}
                formatter={(value) => value}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}