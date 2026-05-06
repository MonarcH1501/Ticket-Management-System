import { useParams } from "react-router-dom"
import { useEffect, useState, useCallback } from "react"
import api from "../api/axios"
import {
  Box, Typography, Chip, CircularProgress,
  Divider, Stack, Avatar, Paper, LinearProgress, Alert, Button
} from "@mui/material"
import {
  ArrowBack, AccessTime, Flag, Person, Category,
  Business, CheckCircle, Schedule, Timeline, Description
} from "@mui/icons-material"

import TicketActions from "../Components/TicketActions"
import TicketWorkflow from "../Components/TicketWorkflow"
import TicketAttachments from "../Components/TicketAttachments"

export default function TicketDetail() {
  const { id } = useParams()
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [canApprove, setCanApprove] = useState(false)

  const fetchTicket = useCallback(async () => {
    try {
      setLoading(true); setError(null)
      const res = await api.get(`/tickets/${id}`)
      setTicket(res.data.data ?? res.data)
    } catch {
      setError("Failed to load ticket details")
    } finally { setLoading(false) }
  }, [id])

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await api.get("/user")
      setCurrentUser(res.data.data ?? res.data)
    } catch (e) { console.error(e) }
  }, [])

  const checkCanApprove = useCallback(() => {
    if (!ticket || !currentUser) return false
    const status = ticket.current_status?.toLowerCase()
    const isWaiting = status === "waiting_unit_approval" || status === "waiting_department_approval"
    const isDesignated = ticket.current_approver_id === currentUser.id
    const hasPending = ticket.approvals?.some(a => a.status === "pending" && a.approver?.id === currentUser.id)
    return isWaiting && (isDesignated || hasPending)
  }, [ticket, currentUser])

  useEffect(() => { fetchCurrentUser() }, [fetchCurrentUser])
  useEffect(() => { fetchTicket() }, [fetchTicket])
  useEffect(() => {
    if (ticket && currentUser) setCanApprove(checkCanApprove())
  }, [ticket, currentUser, checkCanApprove])

  const getStatusConfig = (status) => {
    const s = status?.toLowerCase()
    const map = {
      waiting_unit_approval:       { color: "#d97706", bg: "#fffbeb", label: "Waiting Unit Approval" },
      waiting_department_approval: { color: "#d97706", bg: "#fffbeb", label: "Waiting Dept Approval" },
      waiting_pic_assigned:        { color: "#7c3aed", bg: "#f5f3ff", label: "Waiting PIC Assigned" },
      in_progress:                 { color: "#0284c7", bg: "#f0f9ff", label: "In Progress" },
      waiting_department_review:   { color: "#0284c7", bg: "#f0f9ff", label: "Dept Review" },
      completed:                   { color: "#16a34a", bg: "#f0fdf4", label: "Completed" },
      rejected:                    { color: "#dc2626", bg: "#fef2f2", label: "Rejected" }
    }
    return map[s] || { color: "#64748b", bg: "#f8fafc", label: s?.replace(/_/g, " ") || "Unknown" }
  }

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "-"

  const priorityMap = {
    high:   { color: "#dc2626", bg: "#fef2f2", label: "🔴 High" },
    medium: { color: "#d97706", bg: "#fffbeb", label: "🟡 Medium" },
    low:    { color: "#16a34a", bg: "#f0fdf4", label: "🟢 Low" }
  }

  if (loading) return (
    <Box sx={{ p: 3 }}>
      <LinearProgress />
      <Typography color="text.secondary" sx={{ textAlign: "center", mt: 4 }}>Loading ticket details...</Typography>
    </Box>
  )

  if (error || !ticket) return (
    <Box sx={{ p: 3, maxWidth: 600, mx: "auto", mt: 5 }}>
      <Alert severity="error" sx={{ borderRadius: 2 }}>{error || "Ticket not found"}</Alert>
      <Button startIcon={<ArrowBack />} onClick={() => window.history.back()} sx={{ mt: 2 }}>Go Back</Button>
    </Box>
  )

  const statusConfig = getStatusConfig(ticket.current_status)
  const pCfg = priorityMap[ticket.priority?.toLowerCase()] || { color: "#64748b", bg: "#f8fafc", label: ticket.priority || "-" }

  const showActions =
    canApprove ||
    ticket.current_status === "waiting_pic_assigned" ||
    ticket.current_status === "waiting_department_review" ||
    (ticket.current_status === "in_progress" && Number(currentUser?.id) === Number(ticket?.pic_id || ticket?.pic?.id))

  // card style 
  const card = {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 8px rgba(0,0,0,.06)",
    overflow: "hidden",
    fontFamily: "'DM Sans', sans-serif"
  }
  const cardHeader = {
    padding: "16px 20px",
    borderBottom: "1px solid #f1f5f9",
    display: "flex", alignItems: "center", gap: 10
  }
  const dot = (color, shadow) => ({
    width: 8, height: 8, borderRadius: "50%",
    background: color, boxShadow: `0 0 0 3px ${shadow}`
  })

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ maxWidth: 1400, mx: "auto" }}>

        {/* ── Back + Title ── */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <button
            onClick={() => window.history.back()}
            style={{
              background: "#fff",
              border: "1.5px solid #e2e8f0",
              borderRadius: 10,
              width: 38,
              height: 38,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            <ArrowBack sx={{ fontSize: 20, color: "#0f172a" }} />
          </button>
          <Box>
            <Typography variant="caption" sx={{ color: "#94a3b8", letterSpacing: 1, fontSize: 11, fontWeight: 600 }}>TICKET DETAILS</Typography>
            <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" }, color: "#0f172a" }}>
              {ticket.title}
            </Typography>
          </Box>
        </Stack>

        {/* ── Quick Info Cards ── */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", lg: "repeat(4, 1fr)" }, gap: 2, mb: 3 }}>
          {[
            { icon: "🎫", label: "Ticket Code", value: ticket.ticket_code },
            { icon: "🗂️", label: "Category",    value: ticket.category?.name || "-" },
            { icon: "👤", label: "Created By",  value: ticket.creator?.name || "-", sub: ticket.unit?.name },
            { icon: null, label: "Status",      chip: true }
          ].map((item, i) => (
            <div key={i} style={{ ...card, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 6 }}>{item.label}</div>
              {item.chip ? (
                <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, background: statusConfig.bg, color: statusConfig.color, fontWeight: 700, fontSize: 12 }}>
                  {statusConfig.label}
                </span>
              ) : (
                <>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{item.value}</div>
                  {item.sub && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{item.sub}</div>}
                </>
              )}
            </div>
          ))}
        </Box>

        {/* ── Main 2-col Grid ── */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 360px" }, gap: 3 }}>

          {/* LEFT */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

            {/* Description */}
            <div style={card}>
              <div style={cardHeader}>
                <div style={dot("#3b82f6", "#dbeafe")} />
                <span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Description</span>
              </div>
              <div style={{ padding: "16px 20px", fontSize: 14, color: "#475569", lineHeight: 1.7 }}>
                {ticket.description || "No description provided"}
              </div>
            </div>

            {/* Details */}
            <div style={card}>
              <div style={cardHeader}>
                <div style={dot("#f59e0b", "#fef3c7")} />
                <span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Details</span>
              </div>
              <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px" }}>
                {[
                  { label: "Priority", value: <span style={{ padding: "2px 10px", borderRadius: 20, background: pCfg.bg, color: pCfg.color, fontWeight: 700, fontSize: 12 }}>{pCfg.label}</span> },
                  { label: "Due Date", value: ticket.due_date ? formatDate(ticket.due_date) : <span style={{ color: "#94a3b8" }}>Not set</span> },
                  { label: "PIC",        value: ticket.pic?.name || <span style={{ color: "#94a3b8" }}>Not assigned</span> },
                  { label: "Department", value: ticket.department?.name || "-" },
                  { label: "Category",   value: ticket.category?.name || "-" },
                  { label: "Created At", value: formatDate(ticket.created_at) }
                ].map((d, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 5 }}>{d.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{d.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Approval History */}
            {ticket.approvals?.length > 0 && (
              <div style={card}>
                <div style={cardHeader}>
                  <div style={dot("#22c55e", "#dcfce7")} />
                  <span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Approval History</span>
                </div>
                <div style={{ padding: "14px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
                  {ticket.approvals.map((a, i) => {
                    const approved = a.status === "approved"
                    const pending  = a.status === "pending"
                    return (
                      <div key={a.id}>
                        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                            background: approved ? "#f0fdf4" : pending ? "#fffbeb" : "#fef2f2",
                            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16
                          }}>
                            {approved ? "✓" : pending ? "⏳" : "✕"}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>
                              {a.role_as?.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                            </div>
                            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>By: {a.approver?.name || "-"}</div>
                            {a.notes && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4, fontStyle: "italic" }}>"{a.notes}"</div>}
                          </div>
                          <div style={{ fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap", flexShrink: 0 }}>
                            {a.approved_at ? formatDate(a.approved_at) : "Pending"}
                          </div>
                        </div>
                        {i < ticket.approvals.length - 1 && <div style={{ borderTop: "1px solid #f1f5f9", marginTop: 12 }} />}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <TicketAttachments ticketId={id} />
          </Box>

          {/* RIGHT */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {showActions && <TicketActions ticket={ticket} refresh={fetchTicket} />}
            <TicketWorkflow ticketId={id} />
          </Box>

        </Box>
      </Box>
    </Box>
  )
}