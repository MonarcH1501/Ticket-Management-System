import { Box, TextField, Avatar } from "@mui/material";

export default function Header() {
  return (
    <Box
      sx={{
        height: 60,
        px: 4,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        zIndex: 1
      }}
    >

      <TextField size="small" placeholder="Search tickets..." sx={{ width: 320 }} />

      <Avatar sx={{ bgcolor: "primary.main" }}>U</Avatar>

    </Box>
  );
}