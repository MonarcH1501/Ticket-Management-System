import { useState, useEffect } from 'react'
import api from '../../api/axios'
import { CircularProgress } from '@mui/material'
import {
  PRIMARY, PRIMARY_DARK, PRIMARY_BG, PRIMARY_BORDER, PRIMARY_TEXT,
  GRADIENT, SHADOW, FOCUS_COLOR
} from '../../theme/colors'

const inputStyle = {
  width: "100%", padding: "9px 12px", fontSize: 13,
  borderRadius: 8, border: `1.5px solid ${PRIMARY_BORDER}`,
  background: "#f0f9ff", color: "#0c4a6e", outline: "none",
  boxSizing: "border-box", fontFamily: "inherit", transition: "border-color .15s"
}
const selectStyle = {
  ...inputStyle,
  appearance: "none",
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 32
}
const focus = e => (e.target.style.borderColor = FOCUS_COLOR)
const blur  = e => (e.target.style.borderColor = PRIMARY_BORDER)

const Label = ({ children }) => (
  <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 5 }}>{children}</div>
)
const initials = name => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'
const getColor = name => [PRIMARY, PRIMARY_DARK, "#22c55e", "#f59e0b", "#ec4899", "#8b5cf6"][(name?.charCodeAt(0) || 0) % 6]

export default function UsersTab({ users, roles, refresh }) {
  const [open, setOpen]               = useState(false)
  const [mode, setMode]               = useState('create')
  const [formData, setFormData]       = useState({ name:'', email:'', password:'', unit_id:'', department_id:'', position_id:'' })
  const [selectedRoles, setSelectedRoles] = useState([])
  const [showPw, setShowPw]           = useState(false)
  const [loading, setLoading]         = useState(false)
  const [toast, setToast]             = useState(null)
  const [units, setUnits]             = useState([])
  const [departments, setDepartments] = useState([])
  const [positions, setPositions]     = useState([])
  const [loadingLookups, setLoadingLookups] = useState(true)

  useEffect(() => {
    const parse = r => { const d = r.data?.data ?? r.data; return Array.isArray(d) ? d : [] }
    setLoadingLookups(true)
    Promise.all([
      api.get('/units'),
      api.get('/departments'),
      api.get('/positions')
    ]).then(([uRes, dRes, pRes]) => {
      setUnits(parse(uRes))
      setDepartments(parse(dRes))
      setPositions(parse(pRes))
    }).catch(console.error)
      .finally(() => setLoadingLookups(false))
  }, [])

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t) }
  }, [toast])

  const openCreate = () => {
    setMode('create')
    setFormData({ name:'', email:'', password:'', unit_id:'', department_id:'', position_id:'' })
    setSelectedRoles([]); setShowPw(false); setOpen(true)
  }

  const openEdit = user => {
    setMode('edit')
    setFormData({ id: user.id, name: user.name, email: user.email, unit_id: user.unit_id || '', department_id: user.department_id || '', position_id: user.position_id || '' })
    setSelectedRoles(user.roles?.map(r => r.name) || [])
    setShowPw(false); setOpen(true)
  }

  const close = () => { setOpen(false); setFormData({}); setSelectedRoles([]); setLoading(false) }

  const save = async () => {
    if (!formData.name || !formData.email) {
      setToast({ text: "Name and email are required", ok: false }); return
    }
    if (mode === 'create' && !formData.password) {
      setToast({ text: "Password is required", ok: false }); return
    }
    setLoading(true)
    try {
      if (mode === 'create') {
        const res = await api.post('/admin/users', {
          name: formData.name, email: formData.email, password: formData.password,
          unit_id: formData.unit_id || null,
          department_id: formData.department_id || null,
          position_id: formData.position_id || null
        })
        if (selectedRoles.length > 0) {
          await api.post(`/admin/users/${res.data.id}/sync-roles`, { roles: selectedRoles })
        }
        setToast({ text: "User created!", ok: true })
      } else {
        await api.put(`/admin/users/${formData.id}`, {
          name: formData.name, email: formData.email,
          unit_id: formData.unit_id || null,
          department_id: formData.department_id || null,
          position_id: formData.position_id || null
        })
        await api.post(`/admin/users/${formData.id}/sync-roles`, { roles: selectedRoles })
        setToast({ text: "User updated!", ok: true })
      }
      await refresh(); close()
    } catch (err) {
      const msg = err.response?.data?.message || Object.values(err.response?.data || {}).flat().join(', ') || "Operation failed"
      setToast({ text: msg, ok: false })
    } finally { setLoading(false) }
  }

  const del = async user => {
    if (!window.confirm(`Delete "${user.name}"?`)) return
    try {
      await api.delete(`/admin/users/${user.id}`)
      setToast({ text: "User deleted", ok: true }); await refresh()
    } catch { setToast({ text: "Delete failed", ok: false }) }
  }

  const toggleRole = name => setSelectedRoles(p => p.includes(name) ? p.filter(x => x !== name) : [...p, name])

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: "#0c4a6e" }}>Users</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Manage system users</div>
        </div>
        <button onClick={openCreate} style={{ padding: "9px 18px", borderRadius: 8, border: "none", background: GRADIENT, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit", boxShadow: SHADOW }}>
          + Create User
        </button>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 14, border: `1px solid ${PRIMARY_BORDER}`, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f0f9ff" }}>
              {["User","Email","Unit","Department","Roles","Actions"].map(h => (
                <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontWeight: 700, fontSize: 11, color: PRIMARY_TEXT, letterSpacing: ".06em", textTransform: "uppercase", borderBottom: `1px solid ${PRIMARY_BORDER}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={user.id} style={{ borderBottom: i < users.length - 1 ? `1px solid ${PRIMARY_BG}` : "none" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f0f9ff")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: getColor(user.name), display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 12, flexShrink: 0 }}>
                      {initials(user.name)}
                    </div>
                    <span style={{ fontWeight: 600, color: "#0c4a6e" }}>{user.name}</span>
                  </div>
                </td>
                <td style={{ padding: "12px 16px", color: "#64748b" }}>{user.email}</td>
                <td style={{ padding: "12px 16px", color: "#64748b" }}>{user.unit?.name || "-"}</td>
                <td style={{ padding: "12px 16px", color: "#64748b" }}>{user.department?.name || "-"}</td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {user.roles?.map(r => (
                      <span key={r.id} style={{ padding: "2px 8px", borderRadius: 20, background: PRIMARY_BG, color: PRIMARY_TEXT, fontSize: 11, fontWeight: 700 }}>{r.name}</span>
                    ))}
                  </div>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => openEdit(user)} style={{ padding: "5px 12px", borderRadius: 6, border: `1.5px solid ${PRIMARY_BORDER}`, background: "#fff", color: PRIMARY, fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}
                      onMouseEnter={e => (e.currentTarget.style.background = PRIMARY_BG)} onMouseLeave={e => (e.currentTarget.style.background = "#fff")}>Edit</button>
                    <button onClick={() => del(user)} style={{ padding: "5px 12px", borderRadius: 6, border: "1.5px solid #fee2e2", background: "#fff", color: "#dc2626", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#fef2f2")} onMouseLeave={e => (e.currentTarget.style.background = "#fff")}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#64748b", fontSize: 13 }}>No users found</div>}
      </div>

      {/* Modal */}
      {open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 24 }}
          onClick={e => e.target === e.currentTarget && close()}>
          <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 480, boxShadow: "0 20px 60px rgba(0,0,0,.15)", overflow: "hidden", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${PRIMARY_BG}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
              <span style={{ fontWeight: 800, fontSize: 15, color: "#0c4a6e" }}>{mode === 'create' ? 'Create User' : 'Edit User'}</span>
              <button onClick={close} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#94a3b8", lineHeight: 1 }}>×</button>
            </div>

            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14, overflowY: "auto" }}>
              <div>
                <Label>Name *</Label>
                <input value={formData.name || ''} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} style={inputStyle} onFocus={focus} onBlur={blur} placeholder="Full name" />
              </div>
              <div>
                <Label>Email *</Label>
                <input type="email" value={formData.email || ''} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} style={inputStyle} onFocus={focus} onBlur={blur} placeholder="email@example.com" />
              </div>
              {mode === 'create' && (
                <div>
                  <Label>Password *</Label>
                  <div style={{ position: "relative" }}>
                    <input type={showPw ? "text" : "password"} value={formData.password || ''} onChange={e => setFormData(p => ({ ...p, password: e.target.value }))} style={{ ...inputStyle, paddingRight: 40 }} onFocus={focus} onBlur={blur} placeholder="Min 8 characters" />
                    <span onClick={() => setShowPw(p => !p)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", cursor: "pointer", fontSize: 15, color: "#94a3b8" }}>{showPw ? "🙈" : "👁️"}</span>
                  </div>
                </div>
              )}
              <div>
                <Label>Unit</Label>
                <select value={formData.unit_id || ''} onChange={e => setFormData(p => ({ ...p, unit_id: e.target.value }))} disabled={loadingLookups}
                  style={{ ...selectStyle, opacity: loadingLookups ? .65 : 1, cursor: loadingLookups ? "wait" : "pointer" }} onFocus={focus} onBlur={blur}>
                  <option value="">{loadingLookups ? "Loading units..." : "None"}</option>
                  {units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              <div>
                <Label>Department</Label>
                <select value={formData.department_id || ''} onChange={e => setFormData(p => ({ ...p, department_id: e.target.value }))} disabled={loadingLookups}
                  style={{ ...selectStyle, opacity: loadingLookups ? .65 : 1, cursor: loadingLookups ? "wait" : "pointer" }} onFocus={focus} onBlur={blur}>
                  <option value="">{loadingLookups ? "Loading departments..." : "None"}</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <Label>Position</Label>
                <select value={formData.position_id || ''} onChange={e => setFormData(p => ({ ...p, position_id: e.target.value }))} disabled={loadingLookups}
                  style={{ ...selectStyle, opacity: loadingLookups ? .65 : 1, cursor: loadingLookups ? "wait" : "pointer" }} onFocus={focus} onBlur={blur}>
                  <option value="">{loadingLookups ? "Loading positions..." : "None"}</option>
                  {positions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <Label>Roles</Label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {roles.map(r => {
                    const on = selectedRoles.includes(r.name)
                    return (
                      <div key={r.id} onClick={() => toggleRole(r.name)}
                        style={{ padding: "5px 14px", borderRadius: 20, border: `1.5px solid ${on ? PRIMARY : PRIMARY_BORDER}`, background: on ? PRIMARY_BG : "#fff", color: on ? PRIMARY_TEXT : "#64748b", fontWeight: 700, fontSize: 12, cursor: "pointer", transition: "all .15s" }}>
                        {r.name}
                      </div>
                    )
                  })}
                </div>
                {selectedRoles.length === 0 && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>No roles selected</div>}
              </div>
            </div>

            <div style={{ padding: "16px 24px", borderTop: `1px solid ${PRIMARY_BG}`, display: "flex", justifyContent: "flex-end", gap: 10, flexShrink: 0 }}>
              <button onClick={close} style={{ padding: "9px 18px", borderRadius: 8, border: `1.5px solid ${PRIMARY_BORDER}`, background: "#fff", color: "#64748b", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
              <button onClick={save} disabled={loading} style={{ padding: "9px 18px", borderRadius: 8, border: "none", background: loading ? "#e2e8f0" : GRADIENT, color: loading ? "#94a3b8" : "#fff", fontWeight: 700, fontSize: 13, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8 }}>
                {loading ? <><CircularProgress size={14} sx={{ color: "#94a3b8" }} /> Saving...</> : (mode === 'create' ? 'Create' : 'Save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 1000, padding: "12px 20px", borderRadius: 10, background: toast.ok ? "#f0fdf4" : "#fef2f2", border: `1px solid ${toast.ok ? "#bbf7d0" : "#fecaca"}`, color: toast.ok ? "#16a34a" : "#dc2626", fontWeight: 600, fontSize: 13, boxShadow: "0 4px 20px rgba(0,0,0,.1)", fontFamily: "'DM Sans', sans-serif" }}>
          {toast.ok ? "✓" : "⚠"} {toast.text}
        </div>
      )}
    </div>
  )
}
