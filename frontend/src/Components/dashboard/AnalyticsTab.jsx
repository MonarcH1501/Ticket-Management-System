import { useEffect, useState } from "react"
import api from "../../api/axios"

import DepartmentChart from "./DepartmentChart"
import StatusChart from "./StatusChart"
import MetricsCards from "./MetricsCards"
import TrendChart from "./TrendChart"

export default function AnalyticsTab() {
  const [department, setDepartment] = useState([])
  const [status, setStatus]         = useState([])
  const [metrics, setMetrics]       = useState(null)
  const [trends, setTrends]         = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)

  useEffect(() => {
    let isMounted = true

    Promise.all([
      api.get("/tickets/by-department"),
      api.get("/tickets/by-status"),
      api.get("/tickets/metrics"),
      api.get("/tickets/trends")
    ])
      .then(([deptRes, statusRes, metricsRes, trendsRes]) => {
        if (isMounted) {
          setDepartment(deptRes.data || [])
          setStatus(statusRes.data || [])
          setMetrics(metricsRes.data || null)
          setTrends(trendsRes.data || [])
          setLoading(false)
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error(err)
          setError("Failed to load analytics data")
          setLoading(false)
        }
      })

    return () => { isMounted = false }
  }, [])

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 500 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 36, height: 36, border: "3px solid #e2e8f0",
          borderTopColor: "#6366f1", borderRadius: "50%",
          animation: "spin .7s linear infinite", margin: "0 auto 12px"
        }} />
        <div style={{ fontSize: 13, color: "#94a3b8" }}>Loading analytics...</div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  if (error) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 500 }}>
      <div style={{
        padding: "14px 20px", borderRadius: 10,
        background: "#fef2f2", border: "1px solid #fecaca",
        fontSize: 13, color: "#dc2626"
      }}>
        ⚠️ {error}
      </div>
    </div>
  )

  return (
    <div style={{ width: "100%", fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 4 }}>Overview</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>Analytics Dashboard</div>
      </div>

      {/* Metrics row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 16, marginBottom: 20
      }}>
        <MetricsCards data={metrics} />
      </div>

      {/* Charts row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 16, marginBottom: 20
      }}>
        <DepartmentChart data={department} />
        <StatusChart data={status} />
      </div>

      {/* Trend full width */}
      <TrendChart data={trends} />

    </div>
  )
}