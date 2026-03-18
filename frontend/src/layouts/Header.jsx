import { Box, TextField, Avatar } from "@mui/material"

export default function Header() {

  return (

    <Box
      sx={{
        height: 60,
        px: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#0f172a",
        color: "white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}
    >

      <TextField
        size="small"
        placeholder="Search tickets..."
        sx={{
          background: "white",
          borderRadius: 2,
          width: 320,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2
          }
        }}
      />

      <Avatar sx={{ bgcolor: "#6366f1" }}>
        U
      </Avatar>

    </Box>

  )
}