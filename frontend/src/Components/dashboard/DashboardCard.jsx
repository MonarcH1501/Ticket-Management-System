import { Card, CardContent } from "@mui/material";

export default function DashboardCard({ children }) {

  return (
    <Card
      sx={{
        borderRadius: 3,
        background: "#1e293b",
        color: "white",
        boxShadow: "0 10px 30px rgba(0,0,0,0.25)"
      }}
    >
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );

}