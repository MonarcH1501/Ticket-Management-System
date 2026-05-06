import { useNavigate } from "react-router-dom"

const statusConfig = {
  in_progress:                 { color: "#0ea5e9", bg: "#f0f9ff", label: "In Progress" },
  completed:                   { color: "#22c55e", bg: "#f0fdf4", label: "Completed"   },
  waiting_unit_approval:       { color: "#f59e0b", bg: "#fffbeb", label: "Waiting Unit" },
  waiting_department_approval: { color: "#f59e0b", bg: "#fffbeb", label: "Waiting Dept" },
  waiting_pic_assigned:        { color: "#7c3aed", bg: "#f5f3ff", label: "Waiting PIC" },
  rejected:                    { color: "#dc2626", bg: "#fef2f2", label: "Rejected"     }
}

export default function RecentTickets({ tickets = [] }) {
  const navigate = useNavigate()

  if (!tickets.length) return (
    <div style={{ textAlign: "center", padding: "24px 0", fontSize: 13, color: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ fontSize: 28, marginBottom: 6 }}>🎫</div>
      No recent tickets
    </div>
  )

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, fontFamily: "'DM Sans', sans-serif" }}>
      {tickets.map((t, i) => {
        const s = t.current_status?.toLowerCase()
        const cfg = statusConfig[s] || { color: "#64748b", bg: "#f8fafc", label: t.current_status }
        return (
          <div
            key={t.id}
            onClick={() => navigate(`/tickets/${t.id}`)}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 12px", borderRadius: 10, cursor: "pointer",
              transition: "background .15s",
              borderBottom: i < tickets.length - 1 ? "1px solid #f1f5f9" : "none"
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#f8fafc")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            {/* Left */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#6366f1", marginBottom: 2 }}>{t.ticket_code}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.title}</div>
            </div>

            {/* Status */}
            <span style={{
              flexShrink: 0, fontSize: 11, fontWeight: 700,
              padding: "3px 10px", borderRadius: 20,
              background: cfg.bg, color: cfg.color
            }}>
              {cfg.label}
            </span>

            {/* Arrow */}
            <div style={{ flexShrink: 0, color: "#cbd5e1", fontSize: 14 }}>→</div>
          </div>
        )
      })}
    </div>
  )
}