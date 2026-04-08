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
  const [file, setFile] = useState(null)
  const [pics, setPics] = useState([])
  const [selectedPic, setSelectedPic] = useState("")
  const [notes, setNotes] = useState("")

  // ================= GET USER =================
  useEffect(() => {
    api.get("/user")
      .then(res => setUser(res.data.data ?? res.data))
      .catch(err => console.error(err))
  }, [])

  // ================= LOAD PIC =================
  useEffect(() => {
    const deptId = ticket?.department?.id
    if (!deptId) return

    api.get(`/users?role=pic&department_id=${deptId}`)
      .then(res => setPics(res.data.data ?? res.data))
      .catch(err => console.error(err))
  }, [ticket])

  // ================= API =================
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

  const handleSubmitWithFile = async () => {
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      if (file) formData.append("file", file)

      await api.post(`/tickets/${ticket.id}/submit`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      refresh()
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || "Submit gagal")
    } finally {
      setLoading(false)
    }
  }

  // ================= LOGIC =================
  const status = (ticket.current_status || "").toLowerCase()


  const isApprover =
    Number(user?.id) === Number(ticket.current_approver_id) ||
    ticket.approvals?.some(a =>
      a.status === "pending" &&
      Number(a.approver?.id) === Number(user?.id)
    )

  const isPIC =
    Number(user?.id) === Number(ticket?.pic_id || ticket?.pic?.id)

  // ================= STATUS FLAGS =================
  const isUnit = status === "waiting_unit_approval"
  const isDept = status === "waiting_department_approval"
  const isAssignPic = status === "assigned_to_pic"
  const isInProgress = status === "in_progress"
  const isDeptReview = status === "waiting_department_review"


  const canShowActions =
    (isApprover && (
      isUnit ||
      isDept ||
      isAssignPic ||
      isDeptReview
    )) ||
    (isPIC && isInProgress)

  if (!canShowActions) return null

  console.log("=== DEBUG FINAL ===", {
    userId: user?.id,
    status,
    isApprover,
    isPIC,
    canShowActions
  })

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
      <CardContent>

        <Stack spacing={2}>

          <Typography fontWeight={600}>
            Actions
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

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

          {/* ================= DEPARTMENT APPROVAL ================= */}
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
                  handleAction(`/tickets/${ticket.id}/assign-pic`, {
                    pic_id: selectedPic
                  })
                }
              >
                {loading ? "Assigning..." : "Assign PIC"}
              </Button>
            </>
          )}

          {/* ================= PIC SUBMIT ================= */}
          {isPIC && isInProgress && (
            <>
              <Typography fontSize={13} color="text.secondary">
                Submit Work Result
              </Typography>

              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
              />

              {file && (
                <Typography fontSize={12}>
                  Selected: {file.name}
                </Typography>
              )}

              <Button
                variant="contained"
                disabled={loading}
                onClick={handleSubmitWithFile}
              >
                {loading ? "Submitting..." : "Submit Work"}
              </Button>
            </>
          )}

          {/* ================= DEPARTMENT REVIEW ================= */}
          {isApprover && isDeptReview && (
            <>
              <Typography fontSize={13} color="text.secondary">
                Review Result from PIC
              </Typography>

              <TextField
                label="Notes (optional)"
                multiline
                rows={3}
                fullWidth
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />

              <Button
                variant="contained"
                disabled={loading}
                onClick={() =>
                  handleAction(`/tickets/${ticket.id}/department-review`, {
                    action: "approve",
                    notes
                  })
                }
              >
                {loading ? "Processing..." : "Approve & Close"}
              </Button>

              <Button
                variant="outlined"
                color="error"
                disabled={loading}
                onClick={() =>
                  handleAction(`/tickets/${ticket.id}/department-review`, {
                    action: "reject",
                    notes
                  })
                }
              >
                Reject (Back to PIC)
              </Button>
            </>
          )}

        </Stack>

      </CardContent>
    </Card>
  )
}