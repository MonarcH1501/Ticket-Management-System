import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"

import {
  Box,
  Card,
  CardContent,
  Typography
} from "@mui/material"

import TicketForm from "../Components/TicketForm"

export default function CreateTicket(){

  const navigate = useNavigate()

  const [loading,setLoading] = useState(false)

  const handleCreateTicket = async (form,file)=>{

    try{

      setLoading(true)

      const res = await api.post("/tickets",form)

      const ticketId = res.data.data.id

      if(file){

        const formData = new FormData()
        formData.append("file",file)

        await api.post(
          `/tickets/${ticketId}/attachments`,
          formData,
          { headers:{ "Content-Type":"multipart/form-data" } }
        )

      }

      navigate("/tickets/alltickets")

    }catch(err){

      console.error(err)
      alert("Failed to create ticket")

    }finally{

      setLoading(false)

    }

  }

  return(

    <Box sx={{ maxWidth:1000 }}>

      <Typography
        variant="h4"
        sx={{ mb:3, fontWeight:600 }}
      >
        Create Ticket
      </Typography>

      <Card sx={{ borderRadius:3 }}>

        <CardContent sx={{ p:5 }}>

          <TicketForm
            onSubmit={handleCreateTicket}
            loading={loading}
          />

        </CardContent>

      </Card>

    </Box>

  )

}