import { Card, Typography } from "@mui/material";

export default function MetricsCards({ data }) {

  if (!data) return null;

  const items = [
    { label: "Completed Today", value: data.completed_today },
    { label: "Completed This Month", value: data.completed_this_month },
    { label: "Avg Completion Time", value: `${data.average_completion_hours} hrs` }
  ];

  return (
    <>
      {items.map((item, i) => (
        <Card key={i} sx={{ p: 3 }}>
          <Typography fontSize={13} color="text.secondary">
            {item.label}
          </Typography>

          <Typography variant="h5" fontWeight={700}>
            {item.value}
          </Typography>
        </Card>
      ))}
    </>
  );
}