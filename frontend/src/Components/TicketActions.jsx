import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  Button,
  Stack
} from "@mui/material"
import api from "../api/axios"

export default function TicketActions({ ticket, refresh }) {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get("/user").then(res => setUser(res.data))
  }, [])

  if (!user) return null

  const handleAction = async (url, data = {}) => {
    setLoading(true)
    try {
      await api.post(url, data)
      refresh()
    } finally {
      setLoading(false)
    }
  }

  const status = ticket.current_status?.toUpperCase()

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
      <CardContent>

        <Stack spacing={2}>

          {/* UNIT */}
          {status === "WAITING_UNIT_APPROVAL"
            && user.id === ticket.current_approver_id && (
              <>
                <Button
                  variant="contained"
                  disabled={loading}
                  onClick={() =>
                    handleAction(`/tickets/${ticket.id}/unit-approval`, { action: "approve" })
                  }
                >
                  Approve
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  disabled={loading}
                  onClick={() =>
                    handleAction(`/tickets/${ticket.id}/unit-approval`, { action: "reject" })
                  }
                >
                  Reject
                </Button>
              </>
            )}

          {/* DEPARTMENT */}
          {status === "WAITING_DEPARTMENT_APPROVAL"
            && user.id === ticket.current_approver_id && (
              <>
                <Button
                  variant="contained"
                  disabled={loading}
                  onClick={() =>
                    handleAction(`/tickets/${ticket.id}/department-approval`, { action: "approve" })
                  }
                >
                  Approve
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  disabled={loading}
                  onClick={() =>
                    handleAction(`/tickets/${ticket.id}/department-approval`, { action: "reject" })
                  }
                >
                  Reject
                </Button>
              </>
            )}

        </Stack>

      </CardContent>
    </Card>
  )
}