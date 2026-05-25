import { useEffect, useState } from "react"
import api from "../api/axios"
import { PRIMARY, PRIMARY_BG, PRIMARY_BORDER } from "../theme/colors"

const Label = ({ children }) => (
  <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 600, color: "#64748b", letterSpacing: ".06em", textTransform: "uppercase" }}>
    {children}
  </p>
)

const sectionStyle = {
  background: PRIMARY_BG, border: `1px solid ${PRIMARY_BORDER}`,
  borderRadius: 12, padding: "14px 16px", fontSize: 13, color: "#0369a1"
}

const LoadingLine = ({ children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#94a3b8" }}>
    <span style={{ width: 12, height: 12, borderRadius: "50%", border: `2px solid ${PRIMARY_BORDER}`, borderTopColor: PRIMARY, display: "inline-block", animation: "spin .7s linear infinite" }} />
    {children}
  </div>
)

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

const BtnOutline = ({ children, disabled, onClick, color = "#ef4444", borderColor = "#fca5a5" }) => (
  <button disabled={disabled} onClick={onClick}
    style={{ ...btnBase, background: "#fff", color: disabled ? "#94a3b8" : color, border: `1.5px solid ${disabled ? "#e2e8f0" : borderColor}` }}
    onMouseDown={e => !disabled && (e.currentTarget.style.transform = "scale(.98)")}
    onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
  >{children}</button>
)

const NotesField = ({ value, onChange, placeholder = "Add a note..." }) => (
  <div>
    <Label>Notes (optional)</Label>
    <textarea rows={3} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
      onFocus={e => (e.target.style.borderColor = PRIMARY)}
      onBlur={e => (e.target.style.borderColor = PRIMARY_BORDER)}
    />
  </div>
)

function ApprovalBlock({ label, loading, notes, setNotes, onApprove, onReject, extraActions }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={sectionStyle}>{label}</div>
      <NotesField value={notes} onChange={setNotes} />
      <BtnPrimary disabled={loading} onClick={onApprove} color="#22c55e">✓ Approve</BtnPrimary>
      <BtnOutline disabled={loading} onClick={onReject}>✕ Reject</BtnOutline>
      {extraActions}
    </div>
  )
}

export default function TicketActions({ ticket, refresh }) {
  const [user, setUser]                   = useState(null)
  const [loading, setLoading]             = useState(false)
  const [error, setError]                 = useState(null)
  const [file, setFile]                   = useState(null)
  const [fileError, setFileError]         = useState("")
  const [pics, setPics]                   = useState([])
  const [departments, setDepartments]     = useState([])
  const [selectedPic, setSelectedPic]     = useState("")
  const [priority, setPriority]           = useState("medium")
  const [dueDate, setDueDate]             = useState("")
  const [notesAssign, setNotesAssign]     = useState("")
  const [notesUnit, setNotesUnit]         = useState("")
  const [notesDept, setNotesDept]         = useState("")
  const [notesReview, setNotesReview]     = useState("")
  const [showForward, setShowForward]     = useState(false)
  const [forwardDeptId, setForwardDeptId] = useState("")
  const [forwardNotes, setForwardNotes]   = useState("")
  const [loadingUser, setLoadingUser]     = useState(true)
  const [loadingPics, setLoadingPics]     = useState(false)
  const [loadingDepts, setLoadingDepts]   = useState(false)

  const MAX_SIZE_MB    = 10
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

  useEffect(() => {
    setLoadingUser(true)
    api.get("/user")
      .then(r => setUser(r.data.data ?? r.data))
      .catch(console.error)
      .finally(() => setLoadingUser(false))
  }, [])

  useEffect(() => {
    const deptId = ticket?.department?.id
    if (!deptId) return
    setLoadingPics(true)
    api.get(`/users?role=pic&department_id=${deptId}`)
      .then(r => setPics(r.data.data ?? r.data))
      .catch(console.error)
      .finally(() => setLoadingPics(false))
  }, [ticket])

  // Load departments untuk forward (hanya saat isDept)
  useEffect(() => {
    const status = (ticket?.current_status || "").toLowerCase()
    if (status !== "waiting_department_approval") return
    setLoadingDepts(true)
    api.get("/departments")
      .then(r => {
        const all = r.data.data ?? r.data
        // Exclude department ticket saat ini
        setDepartments(all.filter(d => d.id !== ticket?.department?.id))
      })
      .catch(console.error)
      .finally(() => setLoadingDepts(false))
  }, [ticket])

  const handleAction = async (url, data = {}, resetFn) => {
    setLoading(true); setError(null)
    try { await api.post(url, data); resetFn?.(); refresh() }
    catch (e) { setError(e.response?.data?.message || "Action failed") }
    finally { setLoading(false) }
  }

  const handleFileChange = e => {
    setFileError("")
    const picked = e.target.files[0]
    if (!picked) return
    if (picked.size > MAX_SIZE_BYTES) {
      setFileError(`File melebihi ${MAX_SIZE_MB}MB`); e.target.value = ""; return
    }
    setFile(picked); e.target.value = ""
  }

  const handleSubmitWithFile = async () => {
    setLoading(true); setError(null)
    try {
      if (file) {
        const fd = new FormData()
        fd.append("file", file)
        fd.append("stage", "in_progress")
        await api.post(`/tickets/${ticket.id}/attachments`, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
      }
      await api.post(`/tickets/${ticket.id}/submit`)
      setFile(null); refresh()
    } catch (e) {
      setError(e.response?.data?.message || "Submit gagal")
    } finally {
      setLoading(false)
    }
  }

  const handleForward = () => {
    if (!forwardDeptId) return setError("Department tujuan wajib dipilih")
    handleAction(
      `/tickets/${ticket.id}/forward`,
      { department_id: forwardDeptId, notes: forwardNotes },
      () => { setForwardDeptId(""); setForwardNotes(""); setShowForward(false) }
    )
  }

  const status      = (ticket.current_status || "").toLowerCase()
  const actionCandidate = [
    "waiting_unit_approval",
    "waiting_department_approval",
    "waiting_pic_assigned",
    "waiting_department_review",
    "in_progress",
  ].includes(status)

  if (loadingUser && actionCandidate) {
    return (
      <div style={{
        background: "#fff", borderRadius: 16,
        border: `1px solid ${PRIMARY_BORDER}`,
        boxShadow: "0 1px 8px rgba(0,0,0,.06)",
        overflow: "hidden", fontFamily: "'DM Sans', sans-serif"
      }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${PRIMARY_BG}`, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: PRIMARY, boxShadow: `0 0 0 3px ${PRIMARY_BG}` }} />
          <span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Actions Required</span>
        </div>
        <div style={{ padding: "16px 20px" }}>
          <LoadingLine>Checking available actions...</LoadingLine>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  const isApprover  = Number(user?.id) === Number(ticket.current_approver_id)
  const isPIC       = Number(user?.id) === Number(ticket?.pic_id || ticket?.pic?.id)
  const isUnit      = status === "waiting_unit_approval"
  const isDept      = status === "waiting_department_approval"
  const isAssignPic = status === "waiting_pic_assigned"
  const isInProgress = status === "in_progress"
  const isDeptReview = status === "waiting_department_review"
  const canShow     = (isApprover && (isUnit || isDept || isAssignPic || isDeptReview)) || (isPIC && isInProgress)

  if (!canShow) return null

  // Forward hanya muncul saat isDept && isApprover
  const canForward = isApprover && isDept

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
            onApprove={() => handleAction(`/tickets/${ticket.id}/unit-approval`,
              { action: "approve", notes: notesUnit }, () => setNotesUnit(""))}
            onReject={() => {
              if (!notesUnit) return setError("Notes wajib diisi saat reject")
              handleAction(`/tickets/${ticket.id}/unit-approval`,
                { action: "reject", notes: notesUnit }, () => setNotesUnit(""))
            }}
          />
        )}

        {/* DEPT APPROVAL + FORWARD */}
        {isApprover && isDept && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <ApprovalBlock label="Waiting for your department approval"
              loading={loading} notes={notesDept} setNotes={setNotesDept}
              onApprove={() => handleAction(`/tickets/${ticket.id}/department-approval`,
                { action: "approve", notes: notesDept }, () => setNotesDept(""))}
              onReject={() => {
                if (!notesDept) return setError("Notes wajib diisi saat reject")
                handleAction(`/tickets/${ticket.id}/department-approval`,
                  { action: "reject", notes: notesDept }, () => setNotesDept(""))
              }}
            />

            {/* Divider */}
            {canForward && (
              <div style={{ borderTop: `1px dashed ${PRIMARY_BORDER}`, paddingTop: 10 }}>
                {!showForward ? (
                  <BtnOutline
                    disabled={loading}
                    onClick={() => setShowForward(true)}
                    color="#7c3aed"
                    borderColor="#ddd6fe"
                  >
                    🔀 Forward ke Department Lain
                  </BtnOutline>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ ...sectionStyle, color: "#6d28d9", background: "#f5f3ff", borderColor: "#ddd6fe" }}>
                      Forward ticket ke department lain
                    </div>

                    <div>
                      <Label>Department Tujuan</Label>
                      <select
                        value={forwardDeptId}
                        onChange={e => setForwardDeptId(e.target.value)}
                        disabled={loadingDepts}
                        style={{ ...selectStyle, opacity: loadingDepts ? .65 : 1, cursor: loadingDepts ? "wait" : "pointer" }}
                        onFocus={e => (e.target.style.borderColor = "#7c3aed")}
                        onBlur={e => (e.target.style.borderColor = PRIMARY_BORDER)}
                      >
                        <option value="" disabled>{loadingDepts ? "Loading departments..." : "Pilih department..."}</option>
                        {departments.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                      {loadingDepts && <div style={{ marginTop: 6 }}><LoadingLine>Fetching departments...</LoadingLine></div>}
                    </div>

                    <NotesField
                      value={forwardNotes}
                      onChange={setForwardNotes}
                      placeholder="Alasan forward..."
                    />

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <BtnOutline
                        disabled={loading}
                        onClick={() => { setShowForward(false); setForwardDeptId(""); setForwardNotes("") }}
                        color="#64748b"
                        borderColor="#e2e8f0"
                      >
                        Batal
                      </BtnOutline>
                      <BtnPrimary
                        disabled={loading || !forwardDeptId}
                        onClick={handleForward}
                        color="#7c3aed"
                      >
                        🔀 Forward
                      </BtnPrimary>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ASSIGN PIC */}
        {isApprover && isAssignPic && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={sectionStyle}>Assign PIC + Set Priority & Due Date</div>

            <div>
              <Label>PIC</Label>
              <select value={selectedPic} onChange={e => setSelectedPic(e.target.value)} disabled={loadingPics}
                style={{ ...selectStyle, opacity: loadingPics ? .65 : 1, cursor: loadingPics ? "wait" : "pointer" }}
                onFocus={e => (e.target.style.borderColor = PRIMARY)}
                onBlur={e => (e.target.style.borderColor = PRIMARY_BORDER)}>
                <option value="" disabled>{loadingPics ? "Loading PIC..." : "Select PIC..."}</option>
                {pics.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              {loadingPics && <div style={{ marginTop: 6 }}><LoadingLine>Fetching available PIC...</LoadingLine></div>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <Label>Priority</Label>
                <select value={priority} onChange={e => setPriority(e.target.value)} style={selectStyle}
                  onFocus={e => (e.target.style.borderColor = PRIMARY)}
                  onBlur={e => (e.target.style.borderColor = PRIMARY_BORDER)}>
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>
              <div>
                <Label>Due Date</Label>
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = PRIMARY)}
                  onBlur={e => (e.target.style.borderColor = PRIMARY_BORDER)} />
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
              border: `1.5px dashed ${file ? "#86efac" : PRIMARY_BORDER}`, borderRadius: 8,
              cursor: "pointer", background: file ? "#f0fdf4" : PRIMARY_BG, transition: "background .15s"
            }}>
              <span style={{ fontSize: 18 }}>📎</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 13, color: file ? "#16a34a" : "#0369a1", fontWeight: file ? 600 : 400 }}>
                  {file ? file.name : "Click to attach a file (optional)"}
                </span>
                {!file && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Maks. {MAX_SIZE_MB}MB</div>}
              </div>
              {file && (
                <span onClick={e => { e.preventDefault(); setFile(null); setFileError("") }}
                  style={{ fontSize: 18, color: "#f87171", lineHeight: 1, cursor: "pointer", flexShrink: 0 }}>×</span>
              )}
              <input type="file" hidden onChange={handleFileChange} />
            </label>

            {fileError && (
              <div style={{ padding: "8px 12px", borderRadius: 7, background: "#fef2f2", border: "1px solid #fecaca", fontSize: 12, color: "#dc2626" }}>
                ⚠️ {fileError}
              </div>
            )}

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
              onClick={() => handleAction(`/tickets/${ticket.id}/department-review`,
                { action: "approve", notes: notesReview }, () => setNotesReview(""))}>
              ✓ Approve & Close
            </BtnPrimary>
            <BtnOutline disabled={loading} onClick={() => {
              if (!notesReview) return setError("Notes wajib diisi saat reject")
              handleAction(`/tickets/${ticket.id}/department-review`,
                { action: "reject", notes: notesReview }, () => setNotesReview(""))
            }}>✕ Reject (Back to PIC)</BtnOutline>
          </div>
        )}

      </div>
    </div>
  )
}
