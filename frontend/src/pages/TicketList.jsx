import { useEffect, useState } from "react"
import api from "../api/axios"

import {
  Typography,
  Card,
  CardContent,
  Box
} from "@mui/material"

import TicketTable from "../Components/TicketTable"

export default function TicketList() {

  const [tickets,setTickets] = useState([])

  useEffect(()=>{

    api.get("/tickets")
      .then(res=>{
        setTickets(res.data.data ?? res.data)
      })

  },[])

  return (

    <Box>

      <Typography
        variant="h4"
        sx={{
          mb:3,
          fontWeight:600
        }}
      >
        All Tickets
      </Typography>

      <Card
        sx={{
          borderRadius:3,
          boxShadow:"0 6px 20px rgba(0,0,0,0.08)"
        }}
      >
        <CardContent>

          <TicketTable tickets={tickets}/>

        </CardContent>
      </Card>

    </Box>

  )

}