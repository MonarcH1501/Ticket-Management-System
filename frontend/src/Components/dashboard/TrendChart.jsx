import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme
} from "@mui/material";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts";

// CustomTooltip dipindahkan ke luar komponen
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          bgcolor: 'background.paper',
          border: `1px solid`,
          borderColor: 'divider',
          borderRadius: 1,
          p: 1,
          boxShadow: 1
        }}
      >
        <Typography variant="body2" fontWeight="bold">
          {label}
        </Typography>
        {payload.map((p, idx) => (
          <Typography key={idx} variant="body2" color={p.color}>
            {p.name}: {p.value} tickets
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

export default function TrendChart({ data }) {
  const theme = useTheme();

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography sx={{ mb: 2, fontWeight: 600 }}>
            Ticket Trends
          </Typography>
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            No activity yet
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const hasData = data.some(d => (d.created || 0) > 0 || (d.completed || 0) > 0);

  if (!hasData) {
    return (
      <Card>
        <CardContent>
          <Typography sx={{ mb: 2, fontWeight: 600 }}>
            Ticket Trends
          </Typography>
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            No activity yet
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography sx={{ mb: 2, fontWeight: 600 }}>
          Ticket Trends
        </Typography>

        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={theme.palette.divider}
                vertical={false}
              />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke={theme.palette.text.secondary}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke={theme.palette.text.secondary}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              />
              <Line
                type="monotone"
                dataKey="created"
                name="Created"
                stroke={theme.palette.primary.main}
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="completed"
                name="Completed"
                stroke={theme.palette.success.main}
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}