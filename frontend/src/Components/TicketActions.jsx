import { useEffect, useState } from "react"
import api from "../api/axios"
import { PRIMARY, PRIMARY_BG, PRIMARY_BORDER } from "../theme/colors"

// ── helpers ───────────────────────────────────────────────────────────────────
const Label = ({ children }) => (
  <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 600, color: "#64748b", letterSpacing: ".06em", textTransform: "uppercase" }}>
    {children}
  </p>
)

const sectionStyle = {
  background: PRIMARY_BG, border: `1px solid ${PRIMARY_BORDER}`,
  borderRadius: 12, padding: "14px 16px", fontSize: 13, color: "#0369a1"
}

const inputStyle = {
  width: "100%", padding: "10px 12px", fontSize: 13, borderRadius: 8,
  border: `1.5px solid ${PRIMARY_BORDER}`, background: "#fff", color: "#0f172a",
  outline: "none", boxSizing: "border-box", transition: "border-color .15s", fontFamily: "inherit"
}

const selectStyle = {
  ...inputStyle, appearance: "none",
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 32
}

const btnBase = {
  width: "100%", padding: "10px 0", borderRadius: 8,
  fontWeight: 600, fontSize: 13, cursor: "pointer", border: "none",
  transition: "opacity .15s, transform .1s"
}

const BtnPrimary = ({ children, disabled, onClick, color }) => (
  <button disabled={disabled} onClick={onClick}
    style={{ ...btnBase, background: disabled ? "#e2e8f0" : (color || PRIMARY), color: disabled ? "#94a3b8" : "#fff" }}
    onMouseDown={e => !disabled && (e.currentTarget.style.transform = "scale(.98)")}
    onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
  >{children}</button>
)

const BtnOutline = ({ children, disabled, onClick }) => (
  <button disabled={disabled} onClick={onClick}
    style={{ ...btnBase, background: "#fff", color: disabled ? "#94a3b8" : "#ef4444", border: `1.5px solid ${disabled ? "#e2e8f0" : "#fca5a5"}` }}
    onMouseDown={e => !disabled && (e.currentTarget.style.transform = "scale(.98)")}
    onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
  >{children}</button>
)

const NotesField = ({ value, onChange }) => (
  <div>
    <Label>Notes (optional)</Label>
    <textarea rows={3} value={value} onChange={e => onChange(e.target.value)}
      placeholder="Add a note..."
      style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
      onFocus={e => (e.target.style.borderColor = PRIMARY)}
      onBlur={e => (e.target.style.borderColor = PRIMARY_BORDER)}
    />
  </div>
)

function ApprovalBlock({ label, loading, notes, setNotes, onApprove, onReject }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={sectionStyle}>{label}</div>
      <NotesField value={notes} onChange={setNotes} />
      <BtnPrimary disabled={loading} onClick={onApprove} color="#22c55e">✓ Approve</BtnPrimary>
      <BtnOutline disabled={loading} onClick={onReject}>✕ Reject</BtnOutline>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function TicketActions({ ticket, refresh }) {
  const [user, setUser]           = useState(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const [file, setFile]           = useState(null)
  const [pics, setPics]           = useState([])
  const [selectedPic, setSelectedPic] = useState("")
  const [priority, setPriority]   = useState("medium")
  const [dueDate, setDueDate]     = useState("")
  const [notesAssign, setNotesAssign] = useState("")
  const [notesUnit, setNotesUnit]   = useState("")
  const [notesDept, setNotesDept]   = useState("")
  const [notesReview, setNotesReview] = useState("")

  useEffect(() => {
    api.get("/user").then(r => setUser(r.data.data ?? r.data)).catch(console.error)
  }, [])

  useEffect(() => {
    const deptId = ticket?.department?.id
    if (!deptId) return
    api.get(`/users?role=pic&department_id=${deptId}`).then(r => setPics(r.data.data ?? r.data)).catch(console.error)
  }, [ticket])

  const handleAction = async (url, data = {}, resetFn) => {
    setLoading(true); setError(null)
    try { await api.post(url, data); resetFn?.(); refresh() }
    catch (e) { setError(e.response?.data?.message || "Action failed") }
    finally { setLoading(false) }
  }

  const handleSubmitWithFile = async () => {
    setLoading(true); setError(null)
    try {
      const fd = new FormData()
      if (file) fd.append("file", file)
      await api.post(`/tickets/${ticket.id}/submit`, fd, { headers: { "Content-Type": "multipart/form-data" } })
      setFile(null); refresh()
    } catch (e) { setError(e.response?.data?.message || "Submit gagal") }
    finally { setLoading(false) }
  }

  const status       = (ticket.current_status || "").toLowerCase()
  const isApprover   = Number(user?.id) === Number(ticket.current_approver_id)
  const isPIC        = Number(user?.id) === Number(ticket?.pic_id || ticket?.pic?.id)
  const isUnit       = status === "waiting_unit_approval"
  const isDept       = status === "waiting_department_approval"
  const isAssignPic  = status === "waiting_pic_assigned"
  const isInProgress = status === "in_progress"
  const isDeptReview = status === "waiting_department_review"
  const canShow      = (isApprover && (isUnit || isDept || isAssignPic || isDeptReview)) || (isPIC && isInProgress)

  if (!canShow) return null

  return (
    <div style={{
      background: "#fff", borderRadius: 16,
      border: `1px solid ${PRIMARY_BORDER}`,
      boxShadow: "0 1px 8px rgba(0,0,0,.06)",
      overflow: "hidden", fontFamily: "'DM Sans', sans-serif"
    }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${PRIMARY_BG}`, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: PRIMARY, boxShadow: `0 0 0 3px ${PRIMARY_BG}` }} />
        <span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Actions Required</span>
      </div>

      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 12px", color: "#b91c1c", fontSize: 13 }}>
            ⚠ {error}
          </div>
        )}

        {/* UNIT APPROVAL */}
        {isApprover && isUnit && (
          <ApprovalBlock label="Waiting for your unit approval"
            loading={loading} notes={notesUnit} setNotes={setNotesUnit}
            onApprove={() => handleAction(`/tickets/${ticket.id}/unit-approval`, { action: "approve", notes: notesUnit }, () => setNotesUnit(""))}
            onReject={() => {
              if (!notesUnit) return setError("Notes wajib diisi saat reject")
              handleAction(`/tickets/${ticket.id}/unit-approval`, { action: "reject", notes: notesUnit }, () => setNotesUnit(""))
            }}
          />
        )}

        {/* DEPT APPROVAL */}
        {isApprover && isDept && (
          <ApprovalBlock label="Waiting for your department approval"
            loading={loading} notes={notesDept} setNotes={setNotesDept}
            onApprove={() => handleAction(`/tickets/${ticket.id}/department-approval`, { action: "approve", notes: notesDept }, () => setNotesDept(""))}
            onReject={() => {
              if (!notesDept) return setError("Notes wajib diisi saat reject")
              handleAction(`/tickets/${ticket.id}/department-approval`, { action: "reject", notes: notesDept }, () => setNotesDept(""))
            }}
          />
        )}

        {/* ASSIGN PIC */}
        {isApprover && isAssignPic && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={sectionStyle}>Assign PIC + Set Priority & Due Date</div>

            <div>
              <Label>PIC</Label>
              <select value={selectedPic} onChange={e => setSelectedPic(e.target.value)} style={selectStyle}
                onFocus={e => (e.target.style.borderColor = PRIMARY)} onBlur={e => (e.target.style.borderColor = PRIMARY_BORDER)}>
                <option value="" disabled>Select PIC...</option>
                {pics.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <Label>Priority</Label>
                <select value={priority} onChange={e => setPriority(e.target.value)} style={{ ...selectStyle }}
                  onFocus={e => (e.target.style.borderColor = PRIMARY)} onBlur={e => (e.target.style.borderColor = PRIMARY_BORDER)}>
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>
              <div>
                <Label>Due Date</Label>
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = PRIMARY)} onBlur={e => (e.target.style.borderColor = PRIMARY_BORDER)} />
              </div>
            </div>

            <NotesField value={notesAssign} onChange={setNotesAssign} />

            <BtnPrimary
              disabled={loading || !selectedPic || !dueDate}
              onClick={() => handleAction(`/tickets/${ticket.id}/assign-pic`,
                { pic_id: selectedPic, priority, due_date: dueDate, notes: notesAssign },
                () => { setSelectedPic(""); setPriority("medium"); setDueDate(""); setNotesAssign("") }
              )}
            >
              Assign PIC
            </BtnPrimary>
          </div>
        )}

        {/* PIC WORK */}
        {isPIC && isInProgress && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={sectionStyle}>Submit your work result</div>
            <label style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
              border: `1.5px dashed ${PRIMARY_BORDER}`, borderRadius: 8, cursor: "pointer",
              background: file ? "#f0fdf4" : PRIMARY_BG, transition: "background .15s"
            }}>
              <span style={{ fontSize: 18 }}>📎</span>
              <span style={{ fontSize: 13, color: file ? "#16a34a" : "#0369a1" }}>
                {file ? file.name : "Click to attach a file"}
              </span>
              <input type="file" hidden onChange={e => setFile(e.target.files[0])} />
            </label>
            <BtnPrimary disabled={loading} onClick={handleSubmitWithFile} color="#8b5cf6">
              Submit Work
            </BtnPrimary>
          </div>
        )}

        {/* DEPT REVIEW */}
        {isApprover && isDeptReview && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={sectionStyle}>Review result from PIC</div>
            <NotesField value={notesReview} onChange={setNotesReview} />
            <BtnPrimary disabled={loading} color="#22c55e"
              onClick={() => handleAction(`/tickets/${ticket.id}/department-review`, { action: "approve", notes: notesReview }, () => setNotesReview(""))}>
              ✓ Approve & Close
            </BtnPrimary>
            <BtnOutline disabled={loading} onClick={() => {
              if (!notesReview) return setError("Notes wajib diisi saat reject")
              handleAction(`/tickets/${ticket.id}/department-review`, { action: "reject", notes: notesReview }, () => setNotesReview(""))
            }}>✕ Reject (Back to PIC)</BtnOutline>
          </div>
        )}

      </div>
    </div>
  )
}