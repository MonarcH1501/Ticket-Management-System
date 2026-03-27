import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"

import {
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  Stack
} from "@mui/material"

import TicketTable from "../Components/TicketTable"

export default function TicketList() {

  const [tickets, setTickets] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    api.get("/tickets")
      .then(res => {
        setTickets(res.data.data ?? res.data)
      })
      .catch(err => {
        console.error(err)
      })
  }, [])

  return (

    <Box sx={{ px: 3, py: 3 }}>

      {/* ACTION BAR */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography sx={{ fontWeight: 500 }}>
          Total: {tickets.length} tickets
        </Typography>

        <Button
          variant="contained"
          sx={{ borderRadius: 2, textTransform: "none" }}
        >
          + Create Ticket
        </Button>
      </Stack>

      {/* TABLE CARD */}
      <Card
        sx={{
          borderRadius: 1,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          overflow: "hidden"
        }}
      >
        <CardContent sx={{ p: 3 }}>

          {tickets.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Typography variant="h6">
                No tickets yet 👀
              </Typography>
              <Typography sx={{ color: "#6b7280", mt: 1 }}>
                Create your first ticket
              </Typography>
            </Box>
          ) : (
            <TicketTable
              tickets={tickets}
              onView={(id) => navigate(`/tickets/${id}`)}
            />
          )}

        </CardContent>
      </Card>

    </Box>
  )
}