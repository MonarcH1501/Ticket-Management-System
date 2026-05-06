import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../../context/auth-context"

const colConfig = {
  "TO DO":       { dot: "#f59e0b", bg: "#fffbeb", badge: "#fef3c7", text: "#92400e" },
  "IN PROGRESS": { dot: "#0ea5e9", bg: "#f0f9ff", badge: "#e0f2fe", text: "#0369a1" },
  "DONE":        { dot: "#22c55e", bg: "#f0fdf4", badge: "#dcfce7", text: "#166534" }
}

const statusLabel = (s = "") =>
  s.replaceAll("_", " ").replace(/\b\w/g, c => c.toUpperCase())

export default function MyTasks({ data }) {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const canViewTodo = user?.roles?.some(r =>
    ["admin", "superadmin", "kepala_department", "kepala_unit"].includes(r.name)
  )

  const process = (items = []) =>
    [...items].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 20)

  const columns = [
    ...(canViewTodo ? [{ title: "TO DO",       items: process(data?.todo) }] : []),
    { title: "IN PROGRESS", items: process(data?.in_progress) },
    { title: "DONE",        items: process(data?.done) }
  ]

  return (
    <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>
      {columns.map((col, i) => {
        const cfg = colConfig[col.title]
        return (
          <div key={i} style={{ minWidth: 280, flex: 1 }}>

            {/* Column Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.dot, boxShadow: `0 0 0 3px ${cfg.badge}` }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", letterSpacing: ".08em" }}>{col.title}</span>
              <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: cfg.badge, color: cfg.text }}>
                {col.items.length}
              </span>
            </div>

            {/* Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {col.items.length === 0 ? (
                <div style={{
                  padding: "20px 16px", borderRadius: 12, border: "1.5px dashed #e2e8f0",
                  textAlign: "center", fontSize: 12, color: "#cbd5e1"
                }}>
                  No tasks
                </div>
              ) : col.items.map(task => (
                <div
                  key={task.id}
                  onClick={() => navigate(`/tickets/${task.id}`)}
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    border: "1.5px solid #e2e8f0",
                    padding: "14px 16px",
                    cursor: "pointer",
                    transition: "transform .15s, box-shadow .15s, border-color .15s",
                    boxShadow: "0 1px 4px rgba(0,0,0,.05)"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-2px)"
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,.08)"
                    e.currentTarget.style.borderColor = cfg.dot
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,.05)"
                    e.currentTarget.style.borderColor = "#e2e8f0"
                  }}
                >
                  {/* Unit */}
                  {task.unit?.name && (
                    <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 5, letterSpacing: ".04em" }}>
                      {task.unit.name}
                    </div>
                  )}

                  {/* Title */}
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", lineHeight: 1.4, marginBottom: 10 }}>
                    {task.title}
                  </div>

                  {/* Footer */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20,
                      background: cfg.bg, color: cfg.text
                    }}>
                      {statusLabel(task.current_status)}
                    </span>
                    {task.ticket_code && (
                      <span style={{ fontSize: 11, color: "#cbd5e1", fontWeight: 500 }}>#{task.ticket_code}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        )
      })}
    </div>
  )
}