import { useEffect, useState } from "react"
import api from "../api/axios"
import { PRIMARY, PRIMARY_BG, PRIMARY_BORDER } from "../theme/colors"

export default function TicketWorkflow({ ticketId }) {
  const [steps, setSteps]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/tickets/${ticketId}/workflow`)
      .then(res => setSteps(res.data.steps ?? []))
      .catch(err => { console.error("Workflow error:", err); setSteps([]) })
      .finally(() => setLoading(false))
  }, [ticketId])

  const dotColor = (status) => {
    if (status === "done")    return { bg: "#22c55e", ring: "#dcfce7" }
    if (status === "current") return { bg: PRIMARY,   ring: PRIMARY_BG }
    return { bg: "#e2e8f0", ring: "#f8fafc" }
  }

  return (
    <div style={{
      background: "#fff", borderRadius: 16,
      border: `1px solid ${PRIMARY_BORDER}`,
      boxShadow: "0 1px 8px rgba(0,0,0,.06)",
      overflow: "hidden", fontFamily: "'DM Sans', sans-serif"
    }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${PRIMARY_BG}`, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#a855f7", boxShadow: "0 0 0 3px #f3e8ff" }} />
        <span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Workflow Timeline</span>
      </div>

      <div style={{ padding: "16px 20px" }}>
        {loading && <div style={{ fontSize: 13, color: "#94a3b8" }}>Loading workflow...</div>}
        {!loading && steps.length === 0 && <div style={{ fontSize: 13, color: "#94a3b8" }}>No workflow yet</div>}

        {!loading && steps.map((step, i) => {
          const { bg, ring } = dotColor(step.status)
          const isLast    = i === steps.length - 1
          const isDone    = step.status === "done"
          const isCurrent = step.status === "current"

          return (
            <div key={i} style={{ display: "flex", gap: 14 }}>
              {/* dot + line */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: bg, boxShadow: `0 0 0 3px ${ring}`, marginTop: 3, flexShrink: 0 }} />
                {!isLast && (
                  <div style={{ width: 2, flex: 1, minHeight: 28, background: isDone ? "#bbf7d0" : PRIMARY_BORDER, margin: "4px 0" }} />
                )}
              </div>

              {/* content */}
              <div style={{ paddingBottom: isLast ? 0 : 20, flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>{step.label}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
                    background: isDone ? "#f0fdf4" : isCurrent ? PRIMARY_BG : "#f8fafc",
                    color: isDone ? "#16a34a" : isCurrent ? PRIMARY : "#94a3b8"
                  }}>
                    {isDone ? "Done" : isCurrent ? "In progress" : "Pending"}
                  </span>
                </div>
                {step.actor && (
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>👤 {step.actor}</div>
                )}
                {step.completed_at && (
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                    {new Date(step.completed_at).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}