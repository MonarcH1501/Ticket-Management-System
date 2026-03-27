import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  Button,
  Stack,
  Typography,
  Chip,
  Divider,
  CircularProgress,
  TextField,
  MenuItem,
  Avatar
} from "@mui/material"
import {
  CheckCircle,
  Cancel,
  AssignmentInd
} from "@mui/icons-material"
import api from "../api/axios"

export default function TicketActions({ ticket, refresh }) {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  const [users, setUsers] = useState([])
  const [selectedPic, setSelectedPic] = useState("")

  useEffect(() => {
    api.get("/user").then(res => setUser(res.data))

    // ambil list user (PIC candidates)
    api.get("/users")
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]))
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
    <Card sx={{ borderRadius: 3, border: "1px solid #e0e0e0" }}>
      <CardContent>

        <Stack spacing={3}>

          {/* HEADER */}
          <Box>
            <Typography fontWeight={600}>
              🎯 Actions
            </Typography>
            <Typography fontSize={13} color="text.secondary">
              Manage this ticket
            </Typography>
          </Box>

          {/* ================= UNIT ================= */}
          {status === "WAITING_UNIT_APPROVAL"
            && user.id === ticket.current_approver_id && (

              <Stack spacing={1.5}>

                <Chip label="Unit Approval" size="small" sx={{ bgcolor: "#fff4e5" }} />

                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<CheckCircle />}
                  disabled={loading}
                  onClick={() =>
                    handleAction(`/tickets/${ticket.id}/unit-approval`, { action: "approve" })
                  }
                >
                  {loading ? <CircularProgress size={20} /> : "Approve"}
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  startIcon={<Cancel />}
                  disabled={loading}
                  onClick={() =>
                    handleAction(`/tickets/${ticket.id}/unit-approval`, { action: "reject" })
                  }
                >
                  Reject
                </Button>

              </Stack>
            )}

          {/* ================= DEPARTMENT ================= */}
          {status === "WAITING_DEPARTMENT_APPROVAL"
            && user.id === ticket.current_approver_id && (

              <Stack spacing={2}>

                <Chip label="Department Approval" size="small" sx={{ bgcolor: "#fff4e5" }} />

                {/* APPROVE */}
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<CheckCircle />}
                  disabled={loading}
                  onClick={() =>
                    handleAction(`/tickets/${ticket.id}/department-approval`, { action: "approve" })
                  }
                >
                  Approve
                </Button>

                {/* REJECT */}
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  startIcon={<Cancel />}
                  disabled={loading}
                  onClick={() =>
                    handleAction(`/tickets/${ticket.id}/department-approval`, { action: "reject" })
                  }
                >
                  Reject
                </Button>

                <Divider />

                {/* 🔥 ASSIGN PIC */}
                <Stack spacing={1.5}>

                  <Typography fontSize={13} fontWeight={500}>
                    Assign PIC
                  </Typography>

                  {/* Current PIC */}
                  {ticket.pic && (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar sx={{ width: 28, height: 28 }}>
                        {ticket.pic.name[0]}
                      </Avatar>
                      <Typography fontSize={13}>
                        Current: {ticket.pic.name}
                      </Typography>
                    </Stack>
                  )}

                  {/* Dropdown */}
                  <TextField
                    select
                    size="small"
                    fullWidth
                    value={selectedPic}
                    onChange={(e) => setSelectedPic(e.target.value)}
                  >
                    {users.map((u) => (
                      <MenuItem key={u.id} value={u.id}>
                        {u.name}
                      </MenuItem>
                    ))}
                  </TextField>

                  {/* Assign Button */}
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<AssignmentInd />}
                    disabled={!selectedPic || loading}
                    onClick={() =>
                      handleAction(`/tickets/${ticket.id}/assign-pic`, {
                        pic_id: selectedPic
                      })
                    }
                    sx={{
                      bgcolor: "#6366f1",
                      "&:hover": { bgcolor: "#4f46e5" }
                    }}
                  >
                    Assign PIC
                  </Button>

                </Stack>

              </Stack>
            )}

          {/* ================= NO ACTION ================= */}
          {![
            "WAITING_UNIT_APPROVAL",
            "WAITING_DEPARTMENT_APPROVAL"
          ].includes(status) && (
            <Typography fontSize={13} color="text.secondary">
              No actions required
            </Typography>
          )}

        </Stack>

      </CardContent>
    </Card>
  )
}