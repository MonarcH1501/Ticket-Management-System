import { Box, Typography } from "@mui/material";

export default function Footer({ children, style }) {

  return (
    <Box
      component="footer"
      sx={{
        mt: 6,
        py: 3,
        borderTop: "1px solid #eee",
        color: "text.secondary",
        textAlign: "center",
        ...style
      }}
    >
      <Typography variant="body2">
        {children || `Ticketing System © ${new Date().getFullYear()}`}
      </Typography>
    </Box>
  );

}