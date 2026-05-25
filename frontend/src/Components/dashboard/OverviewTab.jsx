import { useEffect, useState } from "react"
import api from "../../api/axios"
import { CircularProgress } from "@mui/material"
import { PRIMARY, PRIMARY_BG, PRIMARY_BORDER, SHADOW_SUBTLE } from "../../theme/colors"

import DashboardChart from "./DashboardChart"
import RecentTickets  from "./RecentTickets"

export default function OverviewTab() {
  const [summary, setSummary] = useState(null)
  const [trends, setTrends]   = useState([])
  const [recent, setRecent]   = useState([])
  const [todo, setTodo]       = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/tickets/dashboard")
        setSummary(res.data?.summary)
        setTrends(res.data?.trends ?? [])
        setRecent(res.data?.recent ?? [])
        setTodo(res.data?.my_tasks?.todo ?? [])
      } catch (err) { console.error(err) }
      finally {
        setLoading(false)
        setTimeout(() => window.dispatchEvent(new Event("resize")), 100)
      }
    }
    fetchData()
  }, [])

  if (loading) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 12, fontFamily: "'DM Sans', sans-serif" }}>
      <CircularProgress sx={{ color: PRIMARY }} />
      <span style={{ fontSize: 14, color: "#94a3b8" }}>Loading dashboard...</span>
    </div>
  )

  const total      = summary?.overview?.total     ?? 0
  const completed  = summary?.overview?.completed ?? 0
  const approval   = todo.length
  const inProgress = summary?.overview?.in_progress ?? (total - completed - approval)

  const stats = [
    { title: "Total Tickets", value: total,      color: PRIMARY,    shadow: PRIMARY_BG,  icon: "🎫" },
    { title: "In Progress",   value: inProgress, color: "#0284c7",  shadow: "#e0f2fe",   icon: "⚡" },
    { title: "Completed",     value: completed,  color: "#22c55e",  shadow: "#dcfce7",   icon: "✓"  },
    { title: "Need Approval", value: approval,   color: "#f59e0b",  shadow: "#fef3c7",   icon: "⏳" }
  ]

  const card = {
    background: "#fff", borderRadius: 16,
    border: `1px solid ${PRIMARY_BORDER}`,
    boxShadow: SHADOW_SUBTLE, fontFamily: "'DM Sans', sans-serif"
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
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: PRIMARY, boxShadow: `0 0 0 3px ${PRIMARY_BG}` }} />
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
