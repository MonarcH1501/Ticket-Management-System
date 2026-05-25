import { useState, useEffect } from 'react'
import api from '../../api/axios'
import { PRIMARY, PRIMARY_BG, PRIMARY_BORDER, GRADIENT, SHADOW } from '../../theme/colors'

const inputStyle = {
  width: "100%", padding: "9px 12px", fontSize: 13,
  borderRadius: 8, border: `1.5px solid ${PRIMARY_BORDER}`,
  background: PRIMARY_BG, color: "#0f172a", outline: "none",
  boxSizing: "border-box", fontFamily: "inherit", transition: "border-color .15s"
}
const selectStyle = {
  ...inputStyle, appearance: "none",
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 32
}
const focus = e => (e.target.style.borderColor = PRIMARY)
const blur  = e => (e.target.style.borderColor = PRIMARY_BORDER)
const Label = ({ children }) => (
  <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 5 }}>{children}</div>
)

export default function CategoriesTab({ categories, refresh }) {
  const [dialog, setDialog]     = useState(false)
  const [formData, setFormData] = useState({})
  const [departments, setDepts] = useState([])
  const [saving, setSaving]     = useState(false)
  const [toast, setToast]       = useState(null)
  const [loadingDepts, setLoadingDepts] = useState(true)

  useEffect(() => {
    setLoadingDepts(true)
    api.get('/departments')
      .then(r => setDepts(r.data.data || r.data))
      .catch(console.error)
      .finally(() => setLoadingDepts(false))
  }, [])

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t) }
  }, [toast])

  const openDialog  = (cat = {}) => { setFormData({ is_active: true, ...cat }); setDialog(true) }
  const closeDialog = () => { setDialog(false); setFormData({}); setSaving(false) }
  const handleChange = e => { const { name, value } = e.target; setFormData(p => ({ ...p, [name]: value })) }

  const save = async () => {
    if (!formData.code || !formData.name || !formData.department_id) {
      setToast({ text: "Code, Name, and Department are required", ok: false }); return
    }
    setSaving(true)
    try {
      if (formData.id) await api.put(`/admin/ticket-categories/${formData.id}`, formData)
      else await api.post(`/admin/ticket-categories`, formData)
      setToast({ text: formData.id ? "Category updated!" : "Category created!", ok: true })
      await refresh(); closeDialog()
    } catch (err) {
      setToast({ text: err.response?.data?.message || Object.values(err.response?.data || {}).flat().join(', ') || "Save failed", ok: false })
    } finally { setSaving(false) }
  }

  const del = async (cat) => {
    if (!window.confirm(`Delete "${cat.name}"?`)) return
    try { await api.delete(`/admin/ticket-categories/${cat.id}`); setToast({ text: "Category deleted", ok: true }); await refresh() }
    catch { setToast({ text: "Delete failed", ok: false }) }
  }

  const thStyle = { padding: "11px 16px", textAlign: "left", fontWeight: 700, fontSize: 11, color: "#64748b", letterSpacing: ".06em", textTransform: "uppercase", borderBottom: `1px solid ${PRIMARY_BORDER}`, background: PRIMARY_BG }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: "#0c4a6e" }}>Categories</div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Manage ticket categories</div>
        </div>
        <button onClick={() => openDialog()} style={{ padding: "9px 18px", borderRadius: 8, border: "none", background: GRADIENT, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit", boxShadow: SHADOW }}>
          + Add Category
        </button>
      </div>

      <div style={{ background: "#fff", borderRadius: 14, border: `1px solid ${PRIMARY_BORDER}`, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>{["Code","Name","Department","Active","Actions"].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {categories.map((cat, i) => (
              <tr key={cat.id} style={{ borderBottom: i < categories.length - 1 ? `1px solid ${PRIMARY_BG}` : "none" }}
                onMouseEnter={e => (e.currentTarget.style.background = PRIMARY_BG)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ fontWeight: 700, color: PRIMARY, fontSize: 12, background: PRIMARY_BG, padding: "2px 8px", borderRadius: 6 }}>{cat.code}</span>
                </td>
                <td style={{ padding: "12px 16px", fontWeight: 600, color: "#0f172a" }}>{cat.name}</td>
                <td style={{ padding: "12px 16px", color: "#64748b" }}>{cat.department?.name || "-"}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: cat.is_active ? "#f0fdf4" : "#f8fafc", color: cat.is_active ? "#16a34a" : "#94a3b8" }}>
                    {cat.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => openDialog(cat)} style={{ padding: "5px 12px", borderRadius: 6, border: `1.5px solid ${PRIMARY_BORDER}`, background: "#fff", color: PRIMARY, fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}
                      onMouseEnter={e => (e.currentTarget.style.background = PRIMARY_BG)} onMouseLeave={e => (e.currentTarget.style.background = "#fff")}>Edit</button>
                    <button onClick={() => del(cat)} style={{ padding: "5px 12px", borderRadius: 6, border: "1.5px solid #fee2e2", background: "#fff", color: "#dc2626", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#fef2f2")} onMouseLeave={e => (e.currentTarget.style.background = "#fff")}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#94a3b8", fontSize: 13 }}><div style={{ fontSize: 28, marginBottom: 8 }}>🗂️</div>No categories yet</div>}
      </div>

      {dialog && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 24 }}
          onClick={e => e.target === e.currentTarget && closeDialog()}>
          <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 460, boxShadow: "0 20px 60px rgba(0,0,0,.15)", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${PRIMARY_BG}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 800, fontSize: 15, color: "#0f172a" }}>{formData.id ? "Edit Category" : "Add Category"}</span>
              <button onClick={closeDialog} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#94a3b8", lineHeight: 1 }}>×</button>
            </div>
            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
              <div><Label>Code *</Label><input name="code" value={formData.code || ""} onChange={handleChange} style={inputStyle} onFocus={focus} onBlur={blur} placeholder="e.g. IT-001" /></div>
              <div><Label>Name *</Label><input name="name" value={formData.name || ""} onChange={handleChange} style={inputStyle} onFocus={focus} onBlur={blur} placeholder="Category name" /></div>
              <div>
                <Label>Department *</Label>
                <select name="department_id" value={formData.department_id || ""} onChange={handleChange} disabled={loadingDepts}
                  style={{ ...selectStyle, opacity: loadingDepts ? .65 : 1, cursor: loadingDepts ? "wait" : "pointer" }} onFocus={focus} onBlur={blur}>
                  <option value="">{loadingDepts ? "Loading departments..." : "Select department..."}</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div><Label>Description</Label><textarea name="description" value={formData.description || ""} onChange={handleChange} rows={3} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} onFocus={focus} onBlur={blur} placeholder="Optional description..." /></div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Label>Active</Label>
                <div onClick={() => setFormData(p => ({ ...p, is_active: !p.is_active }))}
                  style={{ width: 44, height: 24, borderRadius: 12, background: formData.is_active ? PRIMARY : "#e2e8f0", cursor: "pointer", position: "relative", transition: "background .2s", flexShrink: 0 }}>
                  <div style={{ position: "absolute", top: 3, left: formData.is_active ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left .2s", boxShadow: "0 1px 4px rgba(0,0,0,.15)" }} />
                </div>
                <span style={{ fontSize: 13, color: formData.is_active ? PRIMARY : "#94a3b8", fontWeight: 600 }}>{formData.is_active ? "Active" : "Inactive"}</span>
              </div>
            </div>
            <div style={{ padding: "16px 24px", borderTop: `1px solid ${PRIMARY_BG}`, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={closeDialog} style={{ padding: "9px 18px", borderRadius: 8, border: `1.5px solid ${PRIMARY_BORDER}`, background: "#fff", color: "#64748b", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
              <button onClick={save} disabled={saving} style={{ padding: "9px 18px", borderRadius: 8, border: "none", background: saving ? "#e2e8f0" : GRADIENT, color: saving ? "#94a3b8" : "#fff", fontWeight: 700, fontSize: 13, cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 1000, padding: "12px 20px", borderRadius: 10, background: toast.ok ? "#f0fdf4" : "#fef2f2", border: `1px solid ${toast.ok ? "#bbf7d0" : "#fecaca"}`, color: toast.ok ? "#16a34a" : "#dc2626", fontWeight: 600, fontSize: 13, boxShadow: "0 4px 20px rgba(0,0,0,.1)" }}>
          {toast.ok ? "✓" : "⚠"} {toast.text}
        </div>
      )}
    </div>
  )
}
