import { useState } from 'react'
import api from '../../api/axios'
import { PRIMARY, PRIMARY_BG, PRIMARY_BORDER, GRADIENT } from '../../theme/colors'

const inputStyle = {
  width: "100%", padding: "9px 12px", fontSize: 13,
  borderRadius: 8, border: `1.5px solid ${PRIMARY_BORDER}`,
  background: PRIMARY_BG, color: "#0f172a", outline: "none",
  boxSizing: "border-box", fontFamily: "inherit", transition: "border-color .15s"
}
const focus = e => (e.target.style.borderColor = PRIMARY)
const blur  = e => (e.target.style.borderColor = PRIMARY_BORDER)
const Label = ({ children }) => (
  <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 5 }}>{children}</div>
)
const BtnPrimary = ({ onClick, disabled, children, color }) => (
  <button onClick={onClick} disabled={disabled}
    style={{ padding: "9px 18px", borderRadius: 8, border: "none", background: disabled ? "#e2e8f0" : (color || PRIMARY), color: disabled ? "#94a3b8" : "#fff", fontWeight: 700, fontSize: 13, cursor: disabled ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
    {children}
  </button>
)
const BtnGhost = ({ onClick, children }) => (
  <button onClick={onClick}
    style={{ padding: "9px 18px", borderRadius: 8, border: `1.5px solid ${PRIMARY_BORDER}`, background: "#fff", color: "#64748b", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
    {children}
  </button>
)
const Modal = ({ open, onClose, title, children, onSave, saving }) => {
  if (!open) return null
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 24 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 400, boxShadow: "0 20px 60px rgba(0,0,0,.15)", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${PRIMARY_BG}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 800, fontSize: 15, color: "#0f172a" }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#94a3b8", lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: "20px 24px" }}>{children}</div>
        <div style={{ padding: "16px 24px", borderTop: `1px solid ${PRIMARY_BG}`, display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <BtnGhost onClick={onClose}>Cancel</BtnGhost>
          <BtnPrimary onClick={onSave} disabled={saving}>{saving ? "Saving..." : "Save"}</BtnPrimary>
        </div>
      </div>
    </div>
  )
}
const Th = ({ children, style = {} }) => (
  <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 700, fontSize: 11, color: "#64748b", letterSpacing: ".06em", textTransform: "uppercase", borderBottom: `1px solid ${PRIMARY_BORDER}`, background: PRIMARY_BG, ...style }}>{children}</th>
)
const Td = ({ children, style = {} }) => (
  <td style={{ padding: "11px 16px", fontSize: 13, color: "#0f172a", borderBottom: `1px solid ${PRIMARY_BG}`, verticalAlign: "middle", ...style }}>{children}</td>
)

export default function RolesTab({ roles, permissions, setRoles, refresh }) {
  const [selectedRoleId, setSelectedRoleId] = useState('')
  const [saving, setSaving]                 = useState(null)
  const [roleDialog, setRoleDialog]   = useState(false)
  const [roleForm, setRoleForm]       = useState({ name: '' })
  const [roleMode, setRoleMode]       = useState('create')
  const [roleLoading, setRoleLoading] = useState(false)
  const [permDialog, setPermDialog]   = useState(false)
  const [permForm, setPermForm]       = useState({ name: '' })
  const [permMode, setPermMode]       = useState('create')
  const [permLoading, setPermLoading] = useState(false)
  const [toast, setToast]             = useState(null)

  const showToast = (text, ok = true) => { setToast({ text, ok }); setTimeout(() => setToast(null), 3000) }
  const selectedRole = roles.find(r => r.id === selectedRoleId)

  const toggle = async (roleId, permId, checked) => {
    let nextPermIds = []
    setRoles(prev => prev.map(role => {
      if (role.id !== roleId) return role
      const updated = checked ? [...role.permissions, permissions.find(p => p.id === permId)] : role.permissions.filter(p => p.id !== permId)
      nextPermIds = updated.map(p => p.id)
      return { ...role, permissions: updated }
    }))
    setSaving(permId)
    try { await api.post(`/admin/roles/${roleId}/permissions`, { permissions: nextPermIds }) }
    catch {
      setRoles(prev => prev.map(role => {
        if (role.id !== roleId) return role
        const reverted = checked ? role.permissions.filter(p => p.id !== permId) : [...role.permissions, permissions.find(p => p.id === permId)]
        return { ...role, permissions: reverted }
      }))
      showToast("Failed to update permission", false)
    } finally { setSaving(null) }
  }

  const openCreateRole  = () => { setRoleMode('create'); setRoleForm({ name: '' }); setRoleDialog(true) }
  const openEditRole    = r => { setRoleMode('edit'); setRoleForm({ id: r.id, name: r.name }); setRoleDialog(true) }
  const closeRoleDialog = () => { setRoleDialog(false); setRoleForm({ name: '' }) }
  const saveRole = async () => {
    if (!roleForm.name.trim()) { showToast("Role name is required", false); return }
    setRoleLoading(true)
    try {
      if (roleMode === 'create') { await api.post('/admin/roles', { name: roleForm.name }); showToast("Role created!") }
      else { await api.put(`/admin/roles/${roleForm.id}`, { name: roleForm.name }); showToast("Role updated!") }
      await refresh(); closeRoleDialog()
    } catch (err) { showToast(err.response?.data?.message || "Save failed", false) }
    finally { setRoleLoading(false) }
  }
  const deleteRole = async r => {
    if (!window.confirm(`Delete role "${r.name}"?`)) return
    try { await api.delete(`/admin/roles/${r.id}`); if (selectedRoleId === r.id) setSelectedRoleId(''); showToast("Role deleted!"); await refresh() }
    catch { showToast("Delete failed", false) }
  }

  const openCreatePerm  = () => { setPermMode('create'); setPermForm({ name: '' }); setPermDialog(true) }
  const openEditPerm    = p => { setPermMode('edit'); setPermForm({ id: p.id, name: p.name }); setPermDialog(true) }
  const closePermDialog = () => { setPermDialog(false); setPermForm({ name: '' }) }
  const savePerm = async () => {
    if (!permForm.name.trim()) { showToast("Permission name is required", false); return }
    setPermLoading(true)
    try {
      if (permMode === 'create') { await api.post('/admin/permissions', { name: permForm.name }); showToast("Permission created!") }
      else { await api.put(`/admin/permissions/${permForm.id}`, { name: permForm.name }); showToast("Permission updated!") }
      await refresh(); closePermDialog()
    } catch (err) { showToast(err.response?.data?.message || "Save failed", false) }
    finally { setPermLoading(false) }
  }
  const deletePerm = async p => {
    if (!window.confirm(`Delete permission "${p.name}"?`)) return
    try { await api.delete(`/admin/permissions/${p.id}`); showToast("Permission deleted!"); await refresh() }
    catch { showToast("Delete failed", false) }
  }

  const grouped = permissions.reduce((acc, p) => {
    const group = p.name.includes('.') ? p.name.split('.')[0] : 'general'
    if (!acc[group]) acc[group] = []
    acc[group].push(p)
    return acc
  }, {})

  const actionBtn = (label, onClick, type = 'edit') => {
    const isEdit = type === 'edit'
    return (
      <button onClick={onClick}
        style={{ padding: "3px 10px", borderRadius: 6, border: `1.5px solid ${isEdit ? PRIMARY_BORDER : "#fee2e2"}`, background: "#fff", color: isEdit ? PRIMARY : "#dc2626", fontWeight: 700, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}
        onMouseEnter={e => (e.currentTarget.style.background = isEdit ? PRIMARY_BG : "#fef2f2")}
        onMouseLeave={e => (e.currentTarget.style.background = "#fff")}>
        {label}
      </button>
    )
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Assign Permissions */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 800, fontSize: 16, color: "#0c4a6e" }}>Role Permissions</div>
        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Assign permissions to roles</div>
      </div>

      <div style={{ marginBottom: 20, maxWidth: 300 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 6 }}>Select Role</div>
        <select value={selectedRoleId} onChange={e => setSelectedRoleId(e.target.value ? Number(e.target.value) : '')}
          style={{ width: "100%", padding: "10px 12px", fontSize: 13, borderRadius: 9, border: `1.5px solid ${PRIMARY_BORDER}`, background: PRIMARY_BG, color: "#0f172a", outline: "none", fontFamily: "inherit", appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 32, transition: "border-color .15s" }}
          onFocus={focus} onBlur={blur}>
          <option value="">Choose a role...</option>
          {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
      </div>

      {!selectedRole ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#94a3b8", background: PRIMARY_BG, borderRadius: 14, border: `1.5px dashed ${PRIMARY_BORDER}` }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🔐</div>
          <div style={{ fontSize: 13 }}>Select a role to manage permissions</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: PRIMARY_BG, borderRadius: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: PRIMARY, boxShadow: `0 0 0 3px ${PRIMARY_BORDER}` }} />
            <span style={{ fontWeight: 700, fontSize: 14, color: "#0c4a6e" }}>{selectedRole.name}</span>
            <span style={{ fontSize: 12, color: PRIMARY, marginLeft: 4 }}>— {selectedRole.permissions?.length || 0} permission{selectedRole.permissions?.length !== 1 ? "s" : ""} active</span>
          </div>
          {Object.entries(grouped).map(([group, perms]) => (
            <div key={group} style={{ background: "#fff", borderRadius: 14, border: `1px solid ${PRIMARY_BORDER}`, overflow: "hidden" }}>
              <div style={{ padding: "11px 16px", background: PRIMARY_BG, borderBottom: `1px solid ${PRIMARY_BORDER}`, fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: ".06em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8 }}>
                <span>{group}</span>
                <span style={{ fontWeight: 600, color: "#94a3b8", fontSize: 10 }}>({perms.filter(p => selectedRole.permissions?.some(rp => rp.id === p.id)).length}/{perms.length})</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", padding: 12, gap: 8 }}>
                {perms.map(p => {
                  const checked = selectedRole.permissions?.some(rp => rp.id === p.id)
                  const isSaving = saving === p.id
                  return (
                    <div key={p.id} onClick={() => !isSaving && toggle(selectedRole.id, p.id, !checked)}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${checked ? PRIMARY_BORDER : "#e2e8f0"}`, background: checked ? PRIMARY_BG : "#fafafa", cursor: isSaving ? "wait" : "pointer", transition: "all .15s", userSelect: "none" }}>
                      <div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${checked ? PRIMARY : "#cbd5e1"}`, background: checked ? PRIMARY : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .15s" }}>
                        {checked && <span style={{ color: "#fff", fontSize: 11, lineHeight: 1, fontWeight: 900 }}>✓</span>}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: checked ? "#0c4a6e" : "#64748b", flex: 1 }}>
                        {p.name.includes('.') ? p.name.split('.').slice(1).join('.') : p.name}
                      </span>
                      {isSaving && <span style={{ width: 10, height: 10, borderRadius: "50%", border: `2px solid ${PRIMARY_BORDER}`, borderTopColor: PRIMARY, display: "inline-block", animation: "spin .7s linear infinite", flexShrink: 0 }} />}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ height: 1, background: PRIMARY_BORDER, margin: "32px 0" }} />

      {/* Manage Roles */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: "#0c4a6e" }}>Manage Roles</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Add, edit, or delete roles</div>
          </div>
          <button onClick={openCreateRole} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: PRIMARY, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>+ Add Role</button>
        </div>
        <div style={{ borderRadius: 12, border: `1px solid ${PRIMARY_BORDER}`, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><Th>#</Th><Th>Role Name</Th><Th>Permissions</Th><Th style={{ textAlign: "right" }}>Actions</Th></tr></thead>
            <tbody>
              {roles.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: "32px 16px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No roles yet</td></tr>
              ) : roles.map((r, i) => (
                <tr key={r.id} style={{ background: i % 2 === 0 ? "#fff" : PRIMARY_BG }}>
                  <Td style={{ color: "#94a3b8", width: 48 }}>{i + 1}</Td>
                  <Td><span style={{ fontWeight: 700, color: "#0f172a" }}>{r.name}</span></Td>
                  <Td><span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, background: PRIMARY_BG, color: PRIMARY, fontSize: 12, fontWeight: 700 }}>{r.permissions?.length || 0} perms</span></Td>
                  <Td style={{ textAlign: "right" }}><div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>{actionBtn("Edit", () => openEditRole(r))}{actionBtn("Delete", () => deleteRole(r), 'delete')}</div></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manage Permissions */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: "#0c4a6e" }}>Manage Permissions</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Add, edit, or delete permissions</div>
          </div>
          <button onClick={openCreatePerm} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#22c55e", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>+ Add Permission</button>
        </div>
        <div style={{ borderRadius: 12, border: `1px solid ${PRIMARY_BORDER}`, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><Th>#</Th><Th>Permission Name</Th><Th>Group</Th><Th style={{ textAlign: "right" }}>Actions</Th></tr></thead>
            <tbody>
              {permissions.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: "32px 16px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No permissions yet</td></tr>
              ) : permissions.map((p, i) => {
                const group  = p.name.includes('.') ? p.name.split('.')[0] : 'general'
                const action = p.name.includes('.') ? p.name.split('.').slice(1).join('.') : p.name
                return (
                  <tr key={p.id} style={{ background: i % 2 === 0 ? "#fff" : PRIMARY_BG }}>
                    <Td style={{ color: "#94a3b8", width: 48 }}>{i + 1}</Td>
                    <Td><span style={{ fontWeight: 600, color: "#0f172a" }}>{action}</span><span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 6 }}>{p.name}</span></Td>
                    <Td><span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, background: "#f1f5f9", color: "#64748b", fontSize: 12, fontWeight: 700 }}>{group}</span></Td>
                    <Td style={{ textAlign: "right" }}><div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>{actionBtn("Edit", () => openEditPerm(p))}{actionBtn("Delete", () => deletePerm(p), 'delete')}</div></Td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={roleDialog} onClose={closeRoleDialog} title={roleMode === 'create' ? 'Add Role' : 'Edit Role'} onSave={saveRole} saving={roleLoading}>
        <Label>Role Name *</Label>
        <input value={roleForm.name} onChange={e => setRoleForm(p => ({ ...p, name: e.target.value }))} onKeyDown={e => e.key === 'Enter' && saveRole()} style={inputStyle} placeholder="e.g. kepala_unit" onFocus={focus} onBlur={blur} />
        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>Gunakan huruf kecil dengan underscore</div>
      </Modal>

      <Modal open={permDialog} onClose={closePermDialog} title={permMode === 'create' ? 'Add Permission' : 'Edit Permission'} onSave={savePerm} saving={permLoading}>
        <Label>Permission Name *</Label>
        <input value={permForm.name} onChange={e => setPermForm(p => ({ ...p, name: e.target.value }))} onKeyDown={e => e.key === 'Enter' && savePerm()} style={inputStyle} placeholder="e.g. tickets.view" onFocus={focus} onBlur={blur} />
        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>Format: <code>group.action</code> — contoh: tickets.create</div>
      </Modal>

      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 1000, padding: "12px 20px", borderRadius: 10, background: toast.ok ? "#f0fdf4" : "#fef2f2", border: `1px solid ${toast.ok ? "#bbf7d0" : "#fecaca"}`, color: toast.ok ? "#16a34a" : "#dc2626", fontWeight: 600, fontSize: 13, boxShadow: "0 4px 20px rgba(0,0,0,.1)" }}>
          {toast.ok ? "✓" : "⚠"} {toast.text}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}