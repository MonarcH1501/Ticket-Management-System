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

  // 🔥 NEW (Assign PIC)
  const [priority, setPriority] = useState("medium")
  const [dueDate, setDueDate] = useState("")
  const [notesAssign, setNotesAssign] = useState("")

  // 🔥 notes per step
  const [notesUnit, setNotesUnit] = useState("")
  const [notesDept, setNotesDept] = useState("")
  const [notesReview, setNotesReview] = useState("")

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

  // ================= GENERIC ACTION =================
  const handleAction = async (url, data = {}, resetFn) => {
    setLoading(true)
    setError(null)

    try {
      await api.post(url, data)
      if (resetFn) resetFn()
      refresh()
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || "Action failed")
    } finally {
      setLoading(false)
    }
  }

  // ================= FILE SUBMIT =================
  const handleSubmitWithFile = async () => {
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      if (file) formData.append("file", file)

      await api.post(`/tickets/${ticket.id}/submit`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      setFile(null)
      refresh()
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || "Submit gagal")
    } finally {
      setLoading(false)
    }
  }

  // ================= STATUS =================
  const status = (ticket.current_status || "").toLowerCase()

  const isApprover =
    Number(user?.id) === Number(ticket.current_approver_id)

  const isPIC =
    Number(user?.id) === Number(ticket?.pic_id || ticket?.pic?.id)

  const isUnit = status === "waiting_unit_approval"
  const isDept = status === "waiting_department_approval"
  const isAssignPic = status === "waiting_pic_assigned"
  const isInProgress = status === "in_progress"
  const isDeptReview = status === "waiting_department_review"

  const canShowActions =
    (isApprover && (isUnit || isDept || isAssignPic || isDeptReview)) ||
    (isPIC && isInProgress)

  if (!canShowActions) return null

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
      <CardContent>

        <Stack spacing={2}>

          <Typography fontWeight={600}>
            Actions
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          {/* ================= UNIT APPROVAL ================= */}
          {isApprover && isUnit && (
            <>
              <Typography fontSize={13}>Waiting Unit Approval</Typography>

              <TextField
                label="Notes (optional)"
                multiline
                rows={3}
                fullWidth
                value={notesUnit}
                onChange={(e) => setNotesUnit(e.target.value)}
              />

              <Button
                variant="contained"
                disabled={loading}
                onClick={() =>
                  handleAction(
                    `/tickets/${ticket.id}/unit-approval`,
                    { action: "approve", notes: notesUnit },
                    () => setNotesUnit("")
                  )
                }
              >
                Approve
              </Button>

              <Button
                variant="outlined"
                color="error"
                disabled={loading}
                onClick={() => {
                  if (!notesUnit) {
                    setError("Notes wajib diisi saat reject")
                    return
                  }

                  handleAction(
                    `/tickets/${ticket.id}/unit-approval`,
                    { action: "reject", notes: notesUnit },
                    () => setNotesUnit("")
                  )
                }}
              >
                Reject
              </Button>
            </>
          )}

          {/* ================= DEPARTMENT APPROVAL ================= */}
          {isApprover && isDept && (
            <>
              <Typography fontSize={13}>Waiting Department Approval</Typography>

              <TextField
                label="Notes (optional)"
                multiline
                rows={3}
                fullWidth
                value={notesDept}
                onChange={(e) => setNotesDept(e.target.value)}
              />

              <Button
                variant="contained"
                disabled={loading}
                onClick={() =>
                  handleAction(
                    `/tickets/${ticket.id}/department-approval`,
                    { action: "approve", notes: notesDept },
                    () => setNotesDept("")
                  )
                }
              >
                Approve
              </Button>

              <Button
                variant="outlined"
                color="error"
                disabled={loading}
                onClick={() => {
                  if (!notesDept) {
                    setError("Notes wajib diisi saat reject")
                    return
                  }

                  handleAction(
                    `/tickets/${ticket.id}/department-approval`,
                    { action: "reject", notes: notesDept },
                    () => setNotesDept("")
                  )
                }}
              >
                Reject
              </Button>
            </>
          )}

          {/* ================= ASSIGN PIC ================= */}
          {isApprover && isAssignPic && (
            <>
              <Typography fontSize={13}>
                Assign PIC + Set Priority & Due Date
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

                {pics.map(pic => (
                  <MenuItem key={pic.id} value={pic.id}>
                    {pic.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Priority"
                fullWidth
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </TextField>

              <TextField
                type="date"
                label="Due Date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />

              <TextField
                label="Notes (optional)"
                multiline
                rows={3}
                fullWidth
                value={notesAssign}
                onChange={(e) => setNotesAssign(e.target.value)}
              />

              <Button
                variant="contained"
                disabled={loading || !selectedPic || !dueDate}
                onClick={() => {
                  if (!selectedPic || !dueDate) {
                    setError("PIC dan Due Date wajib diisi")
                    return
                  }

                  handleAction(
                    `/tickets/${ticket.id}/assign-pic`,
                    {
                      pic_id: selectedPic,
                      priority,
                      due_date: dueDate,
                      notes: notesAssign
                    },
                    () => {
                      setSelectedPic("")
                      setPriority("medium")
                      setDueDate("")
                      setNotesAssign("")
                    }
                  )
                }}
              >
                Assign PIC
              </Button>
            </>
          )}

          {/* ================= PIC WORK ================= */}
          {isPIC && isInProgress && (
            <>
              <Typography fontSize={13}>
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
                Submit Work
              </Button>
            </>
          )}

          {/* ================= DEPARTMENT REVIEW ================= */}
          {isApprover && isDeptReview && (
            <>
              <Typography fontSize={13}>
                Review Result from PIC
              </Typography>

              <TextField
                label="Notes (optional)"
                multiline
                rows={3}
                fullWidth
                value={notesReview}
                onChange={(e) => setNotesReview(e.target.value)}
              />

              <Button
                variant="contained"
                disabled={loading}
                onClick={() =>
                  handleAction(
                    `/tickets/${ticket.id}/department-review`,
                    { action: "approve", notes: notesReview },
                    () => setNotesReview("")
                  )
                }
              >
                Approve & Close
              </Button>

              <Button
                variant="outlined"
                color="error"
                disabled={loading}
                onClick={() => {
                  if (!notesReview) {
                    setError("Notes wajib diisi saat reject")
                    return
                  }

                  handleAction(
                    `/tickets/${ticket.id}/department-review`,
                    { action: "reject", notes: notesReview },
                    () => setNotesReview("")
                  )
                }}
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