import { useLocation, useNavigate } from "react-router-dom"
import { PRIMARY } from "../theme/colors"

export default function AppBreadcrumb() {
  const location = useLocation()
  const navigate  = useNavigate()
  const paths = location.pathname.split("/").filter(Boolean)

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#94a3b8" }}>
      <span
        onClick={() => navigate("/")}
        style={{ cursor: "pointer", color: PRIMARY, fontWeight: 600, transition: "opacity .15s" }}
        onMouseEnter={e => (e.currentTarget.style.opacity = ".7")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
      >
        Dashboard
      </span>
      {paths.map((p, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: "#cbd5e1" }}>›</span>
          <span style={{ color: i === paths.length - 1 ? "#0c4a6e" : "#94a3b8", fontWeight: i === paths.length - 1 ? 600 : 400 }}>
            {p.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
          </span>
        </span>
      ))}
    </div>
  )
}