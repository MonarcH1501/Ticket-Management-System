import { PRIMARY, PRIMARY_BG, PRIMARY_BORDER, SHADOW_SUBTLE } from "../../theme/colors"

export default function MetricsCards({ data }) {
  if (!data) return null

  const items = [
    { label: "Completed Today",        value: data.completed_today,            icon: "✅" },
    { label: "Completed This Month",   value: data.completed_this_month,       icon: "📅" },
    { label: "Avg Completion Time",    value: `${data.average_completion_hours} hrs`, icon: "⏱️" }
  ]

  return (
    <>
      {items.map((item, i) => (
        <div key={i} style={{
          background: "#fff", borderRadius: 14,
          border: `1px solid ${PRIMARY_BORDER}`,
          boxShadow: SHADOW_SUBTLE, padding: "18px 20px",
          fontFamily: "'DM Sans', sans-serif"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: ".07em", textTransform: "uppercase" }}>{item.label}</div>
            <div style={{ fontSize: 20 }}>{item.icon}</div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: PRIMARY, lineHeight: 1 }}>{item.value ?? "-"}</div>
        </div>
      ))}
    </>
  )
}