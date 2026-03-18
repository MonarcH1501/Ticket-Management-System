import { Box, Typography } from "@mui/material"

export default function Footer({ children, style }) {

  return (
    <Box
      component="footer"
      sx={{
        mt: 4,
        py: 2,
        borderTop: "1px solid #e2e8f0",
        color: "text.secondary",
        textAlign: "center",
        background: "#f8fafc",
        ...style
      }}
    >
      <Typography variant="body2">
        {children || `Ticketing System © ${new Date().getFullYear()}`}
      </Typography>
    </Box>
  )
}