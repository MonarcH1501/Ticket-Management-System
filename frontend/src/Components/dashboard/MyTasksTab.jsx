import { useEffect, useState } from "react"
import api from "../../api/axios"

import { Box, Typography, CircularProgress } from "@mui/material"
import MyTasks from "./MyTasks"

export default function MyTasksTab(){

  const [data,setData] = useState(null)
  const [loading,setLoading] = useState(true)

  useEffect(()=>{
    api.get("/tickets/my-tasks")
      .then(res=>{
        setData(res.data)
      })
      .finally(()=>{
        setLoading(false)
      })
  },[])

  return(

    <Box>

      <Typography
        variant="h5"
        sx={{ mb:3, fontWeight:600 }}
      >
        My Tasks
      </Typography>

      {loading ? (
        <Box
          sx={{
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            height:"60vh"
          }}
        >
          <CircularProgress color="primary"/>
        </Box>
      ) : (
        <MyTasks data={data}/>
      )}

    </Box>

  )
}