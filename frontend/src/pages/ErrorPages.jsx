// ── 404 ──────────────────────────────────────────────────────────────────────
import { useNavigate } from 'react-router-dom'

export function NotFound() {
  const navigate = useNavigate()
  return <ErrorPage code="404" emoji="🔍" title="Page Not Found" sub="Sorry, the page you visited does not exist." onBack={() => navigate('/')} />
}

// ── 403 ──────────────────────────────────────────────────────────────────────
export function Forbidden() {
  const navigate = useNavigate()
  return <ErrorPage code="403" emoji="🔒" title="Access Denied" sub="Sorry, you are not authorized to access this page." onBack={() => navigate('/')} />
}

// ── 500 ──────────────────────────────────────────────────────────────────────
export function ServerError() {
  return <ErrorPage code="500" emoji="⚙️" title="Server Error" sub="Sorry, something went wrong on our end." onBack={() => window.location.href = '/'} />
}

// ── Shared component ─────────────────────────────────────────────────────────
function ErrorPage({ code, emoji, title, sub, onBack }) {
  const colors = {
    "404": { accent: "#6366f1", bg: "#eef2ff", glow: "rgba(99,102,241,.15)" },
    "403": { accent: "#f59e0b", bg: "#fffbeb", glow: "rgba(245,158,11,.15)" },
    "500": { accent: "#ef4444", bg: "#fef2f2", glow: "rgba(239,68,68,.15)"  },
  }
  const c = colors[code] || colors["404"]

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#f8fafc", fontFamily: "'DM Sans', sans-serif", padding: 24
    }}>
      {/* Blob */}
      <div style={{ position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${c.glow}, transparent 70%)`, pointerEvents: "none" }} />

      <div style={{ textAlign: "center", position: "relative", zIndex: 1, maxWidth: 440 }}>

        {/* Emoji */}
        <div style={{ fontSize: 64, marginBottom: 16, lineHeight: 1 }}>{emoji}</div>

        {/* Code */}
        <div style={{
          fontSize: 96, fontWeight: 900, lineHeight: 1, marginBottom: 8,
          background: `linear-gradient(135deg, ${c.accent}, ${c.accent}99)`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          {code}
        </div>

        {/* Title */}
        <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 10 }}>
          {title}
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 32, lineHeight: 1.6 }}>
          {sub}
        </div>

        {/* Button */}
        <button
          onClick={onBack}
          style={{
            padding: "11px 28px", borderRadius: 10, border: "none",
            background: `linear-gradient(135deg, ${c.accent}, ${c.accent}cc)`,
            color: "#fff", fontWeight: 700, fontSize: 14,
            cursor: "pointer", fontFamily: "inherit",
            boxShadow: `0 4px 14px ${c.glow}`,
            transition: "opacity .15s, transform .15s"
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = ".9"; e.currentTarget.style.transform = "translateY(-1px)" }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1";  e.currentTarget.style.transform = "translateY(0)" }}
        >
          ← Back to Home
        </button>

      </div>
    </div>
  )
}