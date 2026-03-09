import { useEffect, useState } from "react"
import api from "../../api/axios"

import { Grid } from "@mui/material"
import DepartmentChart from "./DepartmentChart"

export default function AnalyticsTab(){

  const [department,setDepartment] = useState([])

  useEffect(()=>{

    api.get("/tickets/by-department")
      .then(res=>{
        setDepartment(res.data)
      })

  },[])

  return(

    <Grid container spacing={3}>

      <Grid item xs={12} md={6}>
        <DepartmentChart data={department}/>
      </Grid>

    </Grid>

  )

}