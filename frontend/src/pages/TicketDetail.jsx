import { useParams } from "react-router-dom"
import { useEffect, useState, useCallback } from "react"
import api from "../api/axios"
import { LinearProgress } from "@mui/material"
import { ArrowBack } from "@mui/icons-material"
import { PRIMARY, PRIMARY_BG, PRIMARY_BORDER, SHADOW_SUBTLE, STATUS, PRIORITY } from "../theme/colors"

import TicketActions     from "../Components/TicketActions"
import TicketWorkflow    from "../Components/TicketWorkflow"
import TicketAttachments from "../Components/TicketAttachments"

export default function TicketDetail() {
  const { id } = useParams()
  const [ticket, setTicket]           = useState(null)
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [canApprove, setCanApprove]   = useState(false)

  const fetchTicket = useCallback(async () => {
    try { setLoading(true); setError(null); const res = await api.get(`/tickets/${id}`); setTicket(res.data.data ?? res.data) }
    catch { setError("Failed to load ticket details") }
    finally { setLoading(false) }
  }, [id])

  const fetchCurrentUser = useCallback(async () => {
    try { const res = await api.get("/user"); setCurrentUser(res.data.data ?? res.data) }
    catch (e) { console.error(e) }
  }, [])

  const checkCanApprove = useCallback(() => {
    if (!ticket || !currentUser) return false
    const s = ticket.current_status?.toLowerCase()
    const isWaiting = s === "waiting_unit_approval" || s === "waiting_department_approval"
    const isDesignated = ticket.current_approver_id === currentUser.id
    const hasPending = ticket.approvals?.some(a => a.status === "pending" && a.approver?.id === currentUser.id)
    return isWaiting && (isDesignated || hasPending)
  }, [ticket, currentUser])

  useEffect(() => { fetchCurrentUser() }, [fetchCurrentUser])
  useEffect(() => { fetchTicket() }, [fetchTicket])
  useEffect(() => { if (ticket && currentUser) setCanApprove(checkCanApprove()) }, [ticket, currentUser, checkCanApprove])

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "-"

  if (loading) return (
    <div style={{ padding: 24 }}>
      <LinearProgress sx={{ "& .MuiLinearProgress-bar": { backgroundColor: PRIMARY }, backgroundColor: PRIMARY_BG }} />
      <div style={{ textAlign: "center", marginTop: 32, fontSize: 14, color: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }}>Loading ticket details...</div>
    </div>
  )

  if (error || !ticket) return (
    <div style={{ padding: 24, maxWidth: 600, margin: "40px auto", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ padding: "14px 18px", borderRadius: 10, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 13, marginBottom: 16 }}>
        ⚠ {error || "Ticket not found"}
      </div>
      <button onClick={() => window.history.back()} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: PRIMARY, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
        ← Go Back
      </button>
    </div>
  )

  const statusCfg = STATUS[ticket.current_status?.toLowerCase()] || { color: "#64748b", bg: "#f8fafc", label: ticket.current_status }
  const pCfg      = PRIORITY[ticket.priority?.toLowerCase()] || { color: "#64748b", bg: "#f8fafc", label: ticket.priority || "-" }

  const showActions = canApprove
    || ticket.current_status === "waiting_pic_assigned"
    || ticket.current_status === "waiting_department_review"
    || ticket.current_status === "waiting_department_approval"
    || (ticket.current_status === "in_progress" && Number(currentUser?.id) === Number(ticket?.pic_id || ticket?.pic?.id))

  const card = { background: "#fff", borderRadius: 16, border: `1px solid ${PRIMARY_BORDER}`, boxShadow: SHADOW_SUBTLE, overflow: "hidden", fontFamily: "'DM Sans', sans-serif" }
  const cardHeader = { padding: "16px 20px", borderBottom: `1px solid ${PRIMARY_BG}`, display: "flex", alignItems: "center", gap: 10 }
  const dot = (color, shadow) => ({ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 0 3px ${shadow}` })

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>

        {/* Back + Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <button onClick={() => window.history.back()}
            style={{ background: "#fff", border: `1.5px solid ${PRIMARY_BORDER}`, borderRadius: 10, width: 38, height: 38, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <ArrowBack sx={{ fontSize: 20, color: "#0f172a" }} />
          </button>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>Ticket Details</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#0c4a6e" }}>{ticket.title}</div>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Ticket Code", value: ticket.ticket_code },
            { label: "Category",    value: ticket.category?.name || "-" },
            { label: "Created By",  value: ticket.creator?.name || "-", sub: ticket.unit?.name },
            { label: "Status",      chip: true }
          ].map((item, i) => (
            <div key={i} style={{ ...card, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 6 }}>{item.label}</div>
              {item.chip ? (
                <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, background: statusCfg.bg, color: statusCfg.color, fontWeight: 700, fontSize: 12 }}>{statusCfg.label}</span>
              ) : (
                <>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{item.value}</div>
                  {item.sub && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{item.sub}</div>}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Main 2-col */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20 }}>

          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            <div style={card}>
              <div style={cardHeader}><div style={dot(PRIMARY, PRIMARY_BG)} /><span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Description</span></div>
              <div style={{ padding: "16px 20px", fontSize: 14, color: "#475569", lineHeight: 1.7 }}>{ticket.description || "No description provided"}</div>
            </div>

            <div style={card}>
              <div style={cardHeader}><div style={dot("#f59e0b", "#fef3c7")} /><span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Details</span></div>
              <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px" }}>
                {[
                  { label: "Priority",   value: <span style={{ padding: "2px 10px", borderRadius: 20, background: pCfg.bg, color: pCfg.color, fontWeight: 700, fontSize: 12 }}>{pCfg.label}</span> },
                  { label: "Due Date",   value: ticket.due_date ? formatDate(ticket.due_date) : <span style={{ color: "#94a3b8" }}>Not set</span> },
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

            {/* Forwarded info */}
            {ticket.forwarded_at && (
              <div style={card}>
                <div style={cardHeader}><div style={dot("#f59e0b", "#fef3c7")} /><span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Forward History</span></div>
                <div style={{ padding: "14px 20px", fontSize: 13, color: "#475569" }}>
                  <div>Forwarded from <strong>{ticket.forwarded_from_department?.name || "-"}</strong> by <strong>{ticket.forwarded_by?.name || "-"}</strong></div>
                  <div style={{ color: "#94a3b8", marginTop: 4 }}>{formatDate(ticket.forwarded_at)}</div>
                  {ticket.forward_notes && <div style={{ marginTop: 8, fontStyle: "italic", color: "#64748b" }}>"{ticket.forward_notes}"</div>}
                </div>
              </div>
            )}

            {ticket.approvals?.length > 0 && (
              <div style={card}>
                <div style={cardHeader}><div style={dot("#22c55e", "#dcfce7")} /><span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Approval History</span></div>
                <div style={{ padding: "14px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
                  {ticket.approvals.map((a, i) => {
                    const approved = a.status === "approved"
                    const pending  = a.status === "pending"
                    return (
                      <div key={a.id}>
                        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: approved ? "#f0fdf4" : pending ? "#fffbeb" : "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                            {approved ? "✓" : pending ? "⏳" : "✕"}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>{a.role_as?.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</div>
                            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>By: {a.approver?.name || "-"}</div>
                            {a.notes && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4, fontStyle: "italic" }}>"{a.notes}"</div>}
                          </div>
                          <div style={{ fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap", flexShrink: 0 }}>{a.approved_at ? formatDate(a.approved_at) : "Pending"}</div>
                        </div>
                        {i < ticket.approvals.length - 1 && <div style={{ borderTop: `1px solid ${PRIMARY_BG}`, marginTop: 12 }} />}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <TicketAttachments ticketId={id} />
          </div>

          {/* RIGHT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {showActions && <TicketActions ticket={ticket} refresh={fetchTicket} />}
            <TicketWorkflow ticketId={id} />
          </div>
        </div>
      </div>
    </div>
  )
}