import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  Button,
  Stack,
  Typography,
  Alert,
  TextField,
  MenuItem
} from "@mui/material"
import api from "../api/axios"

export default function TicketActions({ ticket, refresh }) {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false) 
  const [error, setError] = useState(null)

  const [pics, setPics] = useState([])
  const [selectedPic, setSelectedPic] = useState("")

  // ================= USER =================
  useEffect(() => {
    api.get("/user")
      .then(res => setUser(res.data))
      .catch(err => console.error(err))
  }, [])

  // ================= PIC =================
  useEffect(() => {
    const deptId = ticket?.department?.id

    if (!deptId) return

    api.get(`/users?role=pic&department_id=${deptId}`)
      .then(res => {
        setPics(res.data.data ?? res.data) // 🔥 FIX
      })
      .catch(err => console.error(err))

  }, [ticket])

  const handleAction = async (url, data = {}) => {
    setLoading(true)
    setError(null)

    try {
      await api.post(url, data)
      refresh()
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || "Action failed")
    } finally {
      setLoading(false)
    }
  }


  // ================= LOGIC =================
const status = (ticket.current_status || "").toLowerCase()

const isApprover =
  Number(user?.id) === Number(ticket.current_approver_id)

const isUnit = status === "waiting_unit_approval"
const isDept = status === "waiting_department_approval"
const isAssignPic = status === "assigned_to_pic"

// 🔥 DEBUG WAJIB
console.log("=== DEBUG TICKET ACTIONS ===")
console.log({
  userId: user?.id,
  approver: ticket.current_approver_id,
  status: ticket.current_status,
  statusLower: status,
  isApprover,
  isAssignPic,
  pics,
  ticket
})
  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
      <CardContent>

        <Stack spacing={2}>

          <Typography fontWeight={600}>
            Actions
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          {!isApprover && (
            <Alert severity="info">
              You are not assigned as approver for this ticket
            </Alert>
          )}

          {/* ================= UNIT ================= */}
          {isApprover && isUnit && (
            <>
              <Typography fontSize={13} color="text.secondary">
                Waiting Unit Approval
              </Typography>

              <Button
                variant="contained"
                disabled={loading}
                onClick={() =>
                  handleAction(`/tickets/${ticket.id}/unit-approval`, { action: "approve" })
                }
              >
                {loading ? "Processing..." : "Approve"}
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

          {/* ================= DEPARTMENT ================= */}
          {isApprover && isDept && (
            <>
              <Typography fontSize={13} color="text.secondary">
                Waiting Department Approval
              </Typography>

              <Button
                variant="contained"
                disabled={loading}
                onClick={() =>
                  handleAction(`/tickets/${ticket.id}/department-approval`, { action: "approve" })
                }
              >
                {loading ? "Processing..." : "Approve"}
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

          {/* ================= ASSIGN PIC ================= */}
          {isApprover && isAssignPic && (
            <>
              <Typography fontSize={13} color="text.secondary">
                Assign PIC
              </Typography>

              <TextField
                select
                fullWidth
                value={selectedPic}
                onChange={(e) => setSelectedPic(e.target.value)}
              >
                <MenuItem value="" disabled>
                  Select PIC
                </MenuItem>

                {pics.length === 0 && (
                  <MenuItem disabled>No PIC available</MenuItem>
                )}

                {pics.map(pic => (
                  <MenuItem key={pic.id} value={pic.id}>
                    {pic.name}
                  </MenuItem>
                ))}
              </TextField>

              <Button
                variant="contained"
                disabled={loading || !selectedPic}
                onClick={() =>
                  handleAction(
                    `/tickets/${ticket.id}/assign-pic`,
                    { pic_id: selectedPic }
                  )
                }
              >
                {loading ? "Assigning..." : "Assign PIC"}
              </Button>
            </>
          )}

        </Stack>

      </CardContent>
    </Card>
  )
}