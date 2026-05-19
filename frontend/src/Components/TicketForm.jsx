import { useState, useEffect } from "react"
import api from "../api/axios"
import { PRIMARY, PRIMARY_BG, PRIMARY_BORDER, GRADIENT, SHADOW } from "../theme/colors"

const inputStyle = {
  width: "100%", padding: "10px 12px", fontSize: 13,
  borderRadius: 8, border: "1.5px solid #bae6fd",
  background: "#f0f9ff", color: "#0f172a", outline: "none",
  boxSizing: "border-box", fontFamily: "inherit", transition: "border-color .15s"
}
const focus = e => (e.target.style.borderColor = PRIMARY)
const blur  = e => (e.target.style.borderColor = PRIMARY_BORDER)

const Label = ({ children }) => (
  <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 6 }}>
    {children}
  </div>
)

const MAX_SIZE_MB    = 10
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

export default function TicketForm({ onSubmit, loading }) {
  const [files, setFiles]           = useState([])
  const [fileError, setFileError]   = useState("")
  const [departments, setDepts]     = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ title: "", description: "", department_id: "", ticket_category_id: "" })

  useEffect(() => {
    api.get("/departments").then(r => setDepts(r.data)).catch(console.error)
  }, [])

  useEffect(() => {
    if (!form.department_id) return
    api.get("/ticket-categories", { params: { department_id: form.department_id } })
      .then(r => setCategories(r.data)).catch(console.error)
  }, [form.department_id])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value, ...(name === "department_id" && { ticket_category_id: "" }) }))
  }

  const handleFileChange = e => {
    setFileError("")
    const incoming = Array.from(e.target.files)
    const oversized = incoming.filter(f => f.size > MAX_SIZE_BYTES)
    if (oversized.length > 0) {
      setFileError(`File berikut melebihi ${MAX_SIZE_MB}MB: ${oversized.map(f => f.name).join(", ")}`)
      e.target.value = ""; return
    }
    setFiles(prev => {
      const existing = new Set(prev.map(f => f.name + f.size))
      return [...prev, ...incoming.filter(f => !existing.has(f.name + f.size))]
    })
    e.target.value = ""
  }

  const removeFile = i => setFiles(prev => prev.filter((_, idx) => idx !== i))

  const formatSize = b => {
    if (b < 1024) return b + " B"
    if (b < 1024 * 1024) return (b / 1024).toFixed(1) + " KB"
    return (b / (1024 * 1024)).toFixed(1) + " MB"
  }

  const selectStyle = {
    ...inputStyle,
    appearance: "none",
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 32
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Guide */}
      <div style={{ marginBottom: 20, padding: "12px 16px", borderRadius: 10, background: PRIMARY_BG, border: `1px solid ${PRIMARY_BORDER}`, fontSize: 13, color: "#0369a1" }}>
        💡 Process: Kepala Unit approval → Kepala Department approval → PIC works → KD review
      </div>

      <form onSubmit={e => { e.preventDefault(); onSubmit(form, files) }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>

          <div style={{ gridColumn: "1 / -1" }}>
            <Label>Title</Label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="Enter ticket title..."
              style={inputStyle} onFocus={focus} onBlur={blur} required />
          </div>

          <div>
            <Label>Department</Label>
            <select name="department_id" value={form.department_id} onChange={handleChange} style={selectStyle} onFocus={focus} onBlur={blur}>
              <option value="">Select department...</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>

          <div>
            <Label>Category</Label>
            <select name="ticket_category_id" value={form.ticket_category_id} onChange={handleChange}
              disabled={!form.department_id}
              style={{ ...selectStyle, opacity: !form.department_id ? .5 : 1, cursor: !form.department_id ? "not-allowed" : "pointer" }}
              onFocus={focus} onBlur={blur}>
              <option value="">{!form.department_id ? "Select department first" : "Select category..."}</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {!form.department_id && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>Choose a department first</div>}
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <Label>Description</Label>
            <textarea name="description" value={form.description} onChange={handleChange}
              placeholder="Describe your issue in detail..." rows={4}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
              onFocus={focus} onBlur={blur} />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <Label>Attachment</Label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 16px", border: `1.5px dashed ${PRIMARY_BORDER}`, borderRadius: 8, cursor: "pointer", background: PRIMARY_BG, fontSize: 13, color: "#0369a1", fontWeight: 600, transition: "background .15s", width: "fit-content" }}>
              📎 Tambah file
              <input type="file" hidden multiple onChange={handleFileChange} />
            </label>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 5 }}>Maks. {MAX_SIZE_MB}MB per file · Bisa pilih lebih dari satu file</div>
            {fileError && (
              <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 7, background: "#fef2f2", border: "1px solid #fecaca", fontSize: 12, color: "#dc2626" }}>⚠️ {fileError}</div>
            )}
            {files.length > 0 && (
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                {files.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 12px", borderRadius: 7, background: "#f0fdf4", border: "1px solid #bbf7d0", fontSize: 12, color: "#15803d" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6, overflow: "hidden" }}>
                      📄 <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 260 }}>{f.name}</span>
                      <span style={{ color: "#86efac", flexShrink: 0 }}>· {formatSize(f.size)}</span>
                    </span>
                    <button type="button" onClick={() => removeFile(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#f87171", fontSize: 16, lineHeight: 1, padding: "0 2px" }}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" disabled={loading} style={{
              padding: "10px 28px", borderRadius: 8, border: "none",
              background: loading ? "#e2e8f0" : GRADIENT,
              color: loading ? "#94a3b8" : "#fff", fontWeight: 700, fontSize: 14,
              cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
              boxShadow: loading ? "none" : SHADOW, transition: "opacity .15s"
            }}>
              {loading ? "Creating..." : "Create Ticket →"}
            </button>
          </div>

        </div>
      </form>
    </div>
  )
}