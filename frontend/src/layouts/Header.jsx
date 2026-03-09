import { Box, TextField, Avatar } from "@mui/material"

export default function Header(){

  return(

    <Box
      sx={{
        height:52,
        px:4,
        display:"flex",
        alignItems:"center",
        justifyContent:"space-between",
        background:"#0f172a",
        color:"white"
      }}
    >

      <TextField
        size="small"
        placeholder="Search..."
        sx={{
          background:"white",
          borderRadius:1,
          width:300
        }}
      />

      <Avatar/>

    </Box>

  )

}