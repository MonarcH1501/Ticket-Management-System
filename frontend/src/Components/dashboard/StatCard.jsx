import { Card, CardContent, Typography, Box } from "@mui/material";

export default function StatCard({ title, value, icon, gradient }) {

  return (
    <Card
      sx={{
        borderRadius: 3,
        background: gradient,
        color: "white",
        boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        transition: "0.25s",
        "&:hover": { transform: "translateY(-6px)" }
      }}
    >

      <CardContent>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >

          <Box>

            <Typography variant="body2">
              {title}
            </Typography>

            <Typography
              variant="h4"
              sx={{ fontWeight: 700 }}
            >
              {value}
            </Typography>

          </Box>

          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.2)"
            }}
          >
            {icon}
          </Box>

        </Box>

      </CardContent>

    </Card>
  );
}