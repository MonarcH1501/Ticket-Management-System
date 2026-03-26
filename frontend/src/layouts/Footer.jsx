import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box sx={{ py: 2, textAlign: "center", color: "text.secondary" }}>
      <Typography variant="body2">
        Ticketing System © {new Date().getFullYear()}
      </Typography>
    </Box>
  );
}