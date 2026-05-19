import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { PRIMARY, PRIMARY_BG } from "../../theme/colors"

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: "#fff", border: "1.5px solid #bae6fd", borderRadius: 10, padding: "10px 14px", boxShadow: "0 4px 16px rgba(0,0,0,.08)", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
      <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, color: "#475569" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }} />
          <span>{p.name}:</span>
          <span style={{ fontWeight: 700, color: p.color }}>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function TrendChart({ data }) {
  const empty = !data?.length || !data.some(d => (d.created || 0) > 0 || (d.completed || 0) > 0)

  return (
    <div style={{ width: "100%", height: "100%", fontFamily: "'DM Sans', sans-serif" }}>
      {empty ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 8, color: "#94a3b8" }}>
          <div style={{ fontSize: 32 }}>📉</div>
          <div style={{ fontSize: 13 }}>No activity yet</div>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
            {[{ label: "Created", color: PRIMARY }, { label: "Completed", color: "#22c55e" }].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b", fontWeight: 600 }}>
                <div style={{ width: 24, height: 2.5, borderRadius: 99, background: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#bae6fd", strokeWidth: 1 }} />
              <Line type="monotone" dataKey="created" name="Created" stroke={PRIMARY} strokeWidth={2.5}
                dot={{ r: 3, fill: PRIMARY, strokeWidth: 0 }} activeDot={{ r: 5, fill: PRIMARY, stroke: PRIMARY_BG, strokeWidth: 3 }} />
              <Line type="monotone" dataKey="completed" name="Completed" stroke="#22c55e" strokeWidth={2.5}
                dot={{ r: 3, fill: "#22c55e", strokeWidth: 0 }} activeDot={{ r: 5, fill: "#22c55e", stroke: "#dcfce7", strokeWidth: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  )
}