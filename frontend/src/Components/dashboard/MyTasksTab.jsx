import { useEffect, useState } from "react"
import api from "../../api/axios"
import { PRIMARY } from "../../theme/colors"
import MyTasks from "./MyTasks"

export default function MyTasksTab() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/tickets/my-tasks")
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 4 }}>Dashboard</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: "#0c4a6e", marginBottom: 20 }}>My Tasks</div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <div style={{ width: 36, height: 36, border: `3px solid #e0f2fe`, borderTopColor: PRIMARY, borderRadius: "50%", animation: "spin .7s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      ) : (
        <MyTasks data={data} />
      )}
    </div>
  )
}