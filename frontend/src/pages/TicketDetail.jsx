import { useParams } from "react-router-dom"
import { useEffect, useState, useCallback } from "react"
import api from "../api/axios"

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Divider,
  Stack
} from "@mui/material"

import TicketActions from "../Components/TicketActions"
import TicketWorkflow from "../Components/TicketWorkflow"
import TicketAttachments from "../Components/TicketAttachments"

export default function TicketDetail() {

  const { id } = useParams()
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)

  // ✅ FIX: useCallback to satisfy exhaustive-deps
  const fetchTicket = useCallback(async () => {
    try {
      setLoading(true)

      const res = await api.get(`/tickets/${id}`)
      setTicket(res.data.data ?? res.data)

    } catch (err) {
      console.error("Failed fetch ticket", err)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchTicket()
  }, [fetchTicket])

  const getStatusColor = (status) => {
    const s = status?.toUpperCase()

    if (s?.includes("WAITING")) return "warning"
    if (s === "IN_PROGRESS") return "info"
    if (s === "DONE") return "success"
    if (s === "REJECTED") return "error"

    return "default"
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!ticket) {
    return (
      <Box sx={{ mt: 5 }}>
        <Typography>Ticket not found</Typography>
      </Box>
    )
  }

  return (

    <Box>

      {/* HEADER */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          🎫 {ticket.title}
        </Typography>

        <Typography fontSize={13} color="text.secondary">
          {ticket.ticket_code}
        </Typography>

        <Box sx={{ mt: 1 }}>
          <Chip
            label={ticket.current_status?.replaceAll("_", " ")}
            color={getStatusColor(ticket.current_status)}
            size="small"
          />
        </Box>
      </Box>

      <Grid container spacing={3}>

        {/* LEFT */}
        <Grid item xs={12} md={8}>

          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent>

              <Stack spacing={2}>

                <Typography fontWeight="bold">
                  Description
                </Typography>

                <Typography color="text.secondary">
                  {ticket.description}
                </Typography>

                <Divider />

                <Grid container spacing={2}>

                  <Grid item xs={6}>
                    <Typography fontSize={12} color="text.secondary">
                      Priority
                    </Typography>
                    <Typography fontWeight="bold">
                      {ticket.priority ?? "-"}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography fontSize={12} color="text.secondary">
                      Due Date
                    </Typography>
                    <Typography fontWeight="bold">
                      {ticket.due_date ?? "-"}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography fontSize={12} color="text.secondary">
                      PIC
                    </Typography>
                    <Typography fontWeight="bold">
                      {ticket.pic?.name ?? "-"}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography fontSize={12} color="text.secondary">
                      Status
                    </Typography>
                    <Typography fontWeight="bold">
                      {ticket.current_status?.replaceAll("_", " ")}
                    </Typography>
                  </Grid>

                </Grid>

              </Stack>

            </CardContent>
          </Card>

        </Grid>

        {/* RIGHT */}
        <Grid item xs={12} md={4}>
          <TicketActions
            ticket={ticket}
            refresh={fetchTicket}
          />
        </Grid>

      </Grid>

      {/* WORKFLOW */}
      <Box sx={{ mt: 4 }}>
        <TicketWorkflow ticketId={id} />
      </Box>

      {/* ATTACHMENTS */}
      <Box sx={{ mt: 4 }}>
        <TicketAttachments ticketId={id} />
      </Box>

    </Box>
  )
}