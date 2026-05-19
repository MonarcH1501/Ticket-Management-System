import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { PRIMARY, PRIMARY_BG } from "../../theme/colors"

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: "#fff", border: "1.5px solid #bae6fd", borderRadius: 10, padding: "10px 14px", boxShadow: "0 4px 16px rgba(0,0,0,.08)", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
      <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, color: "#475569" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.fill }} />
          <span>{p.name}:</span>
          <span style={{ fontWeight: 700, color: p.fill }}>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function DashboardChart({ data }) {
  const empty = !data?.length || !data.some(d => (d.created || 0) > 0 || (d.completed || 0) > 0)

  if (empty) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 8, color: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ fontSize: 32 }}>📊</div>
      <div style={{ fontSize: 13 }}>No activity yet</div>
    </div>
  )

  return (
    <div style={{ width: "100%", height: "100%", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
        {[{ label: "Created", color: PRIMARY }, { label: "Completed", color: "#22c55e" }].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b", fontWeight: 600 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data} barGap={4} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: PRIMARY_BG }} />
          <Bar dataKey="created"   name="Created"   fill={PRIMARY}    radius={[4,4,0,0]} maxBarSize={32} />
          <Bar dataKey="completed" name="Completed" fill="#22c55e" radius={[4,4,0,0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}