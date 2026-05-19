import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"
import { PRIMARY, PRIMARY_DARK, PRIMARY_LIGHT, PRIMARY_BORDER } from "../../theme/colors"

const COLORS = [PRIMARY, "#22c55e", PRIMARY_DARK, "#f59e0b", "#ef4444", PRIMARY_LIGHT, "#8b5cf6"]

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: "#fff", border: "1.5px solid #bae6fd", borderRadius: 10, padding: "10px 14px", boxShadow: "0 4px 16px rgba(0,0,0,.08)", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
      <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>{payload[0].name}</div>
      <div style={{ color: "#64748b" }}>Tickets: <span style={{ fontWeight: 700, color: payload[0].fill }}>{payload[0].value}</span></div>
    </div>
  )
}

export default function StatusChart({ data }) {
  const card = { background: "#fff", borderRadius: 14, border: `1px solid ${PRIMARY_BORDER}`, overflow: "hidden", fontFamily: "'DM Sans', sans-serif" }

  const formatted = (data || [])
    .map((item, i) => ({
      id: i,
      name: (item.current_status || item.status || item.name || "Unknown").replace(/_/g, " "),
      total: item.total || item.count || 0
    }))
    .filter(d => d.total > 0)

  return (
    <div style={card}>
      <div style={{ padding: "14px 16px", borderBottom: `1px solid ${PRIMARY_BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: PRIMARY, boxShadow: `0 0 0 3px #e0f2fe` }} />
        <span style={{ fontWeight: 700, fontSize: 14, color: "#0c4a6e" }}>Tickets by Status</span>
      </div>
      <div style={{ padding: 16 }}>
        {!formatted.length ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: "#94a3b8", fontSize: 13 }}>No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={formatted} dataKey="total" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2} stroke="none" strokeWidth={0} isAnimationActive={false}>
                {formatted.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" strokeWidth={0} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" align="center" height={36} wrapperStyle={{ fontSize: 12, paddingTop: 10 }} iconType="circle" iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}