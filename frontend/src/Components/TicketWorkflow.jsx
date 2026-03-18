import { useEffect, useState } from "react"
import api from "../api/axios"

import {
  Card,
  CardContent,
  Typography,
  Box
} from "@mui/material"

export default function TicketWorkflow({ ticketId }){

  const [workflow,setWorkflow] = useState([])

  useEffect(()=>{

    api.get(`/tickets/${ticketId}/workflow`)
      .then(res=>{

        const data = res.data.data ?? res.data

        if(Array.isArray(data)){
          setWorkflow(data)
        }else{
          setWorkflow([])
        }

      })

  },[ticketId])

  return(

    <Card>

      <CardContent>

        <Typography sx={{ mb:2 }}>
          Workflow History
        </Typography>

        {workflow.length === 0 && (
          <Typography fontSize={14} color="text.secondary">
            No workflow history yet
          </Typography>
        )}

        {workflow.map((w,index)=>(

          <Box key={index} sx={{ mb:1 }}>

            <Typography fontSize={14}>
              {w.role_as} - {w.status}
            </Typography>

          </Box>

        ))}

      </CardContent>

    </Card>

  )

}