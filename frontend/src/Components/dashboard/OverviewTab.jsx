import { useEffect, useState } from "react"
import api from "../../api/axios"
import { CircularProgress } from "@mui/material"

import StatCard from "./StatCard"
import DashboardChart from "./DashboardChart"
import RecentTickets from "./RecentTickets"

export default function OverviewTab() {
  const [summary, setSummary] = useState(null)
  const [trends, setTrends]   = useState([])
  const [recent, setRecent]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get("/tickets/summary"),
      api.get("/tickets/trends"),
      api.get("/tickets/recent")
    ]).then(([s, t, r]) => {
      setSummary(s.data); setTrends(t.data); setRecent(r.data)
    }).catch(console.error).finally(() => setLoading(false))

    setTimeout(() => window.dispatchEvent(new Event("resize")), 100)
  }, [])

  if (loading) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 12, fontFamily: "'DM Sans', sans-serif" }}>
      <CircularProgress sx={{ color: "#6366f1" }} />
      <span style={{ fontSize: 14, color: "#94a3b8" }}>Loading dashboard...</span>
    </div>
  )

  const total     = summary?.overview?.total ?? 0
  const completed = summary?.overview?.completed ?? 0
  const approval  = summary?.my_action?.need_my_approval ?? 0
  const progress  = total - completed - approval

  const stats = [
    { title: "Total Tickets", value: total,     color: "#6366f1", shadow: "#e0e7ff", icon: "🎫" },
    { title: "In Progress",   value: progress,  color: "#0ea5e9", shadow: "#e0f2fe", icon: "⚡" },
    { title: "Completed",     value: completed, color: "#22c55e", shadow: "#dcfce7", icon: "✓"  },
    { title: "Need Approval", value: approval,  color: "#f59e0b", shadow: "#fef3c7", icon: "⏳" }
  ]

  const card = {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 8px rgba(0,0,0,.06)",
    fontFamily: "'DM Sans', sans-serif"
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, fontFamily: "'DM Sans', sans-serif" }}>

      {/* STAT CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ ...card, padding: "20px 20px 16px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: ".08em", textTransform: "uppercase" }}>{s.title}</div>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: s.shadow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                {s.icon}
              </div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ height: 3, borderRadius: 99, background: s.shadow, marginTop: 14 }}>
              <div style={{ height: "100%", borderRadius: 99, background: s.color, width: total > 0 ? `${Math.min((s.value / total) * 100, 100)}%` : "0%", transition: "width .6s ease" }} />
            </div>
          </div>
        ))}
      </div>

      {/* CHART */}
      <div style={{ ...card, padding: 24, height: 370 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1", boxShadow: "0 0 0 3px #e0e7ff" }} />
          Ticket Trends
        </div>
        <DashboardChart data={trends} />
      </div>

      {/* RECENT */}
      <div style={{ ...card, padding: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 0 3px #dcfce7" }} />
          Recent Tickets
        </div>
        <RecentTickets tickets={recent} />
      </div>

    </div>
  )
}