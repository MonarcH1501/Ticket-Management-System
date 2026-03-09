import { useEffect, useState } from "react"
import api from "../../api/axios"

import { Box, Typography } from "@mui/material"
import MyTasks from "./MyTasks"

export default function MyTasksTab(){

  const [tasks,setTasks] = useState([])

  useEffect(()=>{

    api.get("/tickets/my-tasks")
      .then(res=>{
        setTasks(res.data)
      })

  },[])

  return(

    <Box>

      <Typography
        variant="h5"
        sx={{ mb:2 }}
      >
        My Tasks
      </Typography>

      <MyTasks tasks={tasks}/>

    </Box>

  )

}