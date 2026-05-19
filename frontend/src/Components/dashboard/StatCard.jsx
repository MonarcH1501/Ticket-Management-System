import { PRIMARY, PRIMARY_BG, PRIMARY_BORDER, SHADOW_SUBTLE } from "../../theme/colors"

// StatCard sekarang konsisten dengan OverviewTab inline cards
// gradient prop masih diterima untuk backward compat tapi tidak dipakai
export default function StatCard({ title, value, icon, color, shadow }) {
  const c = color  || PRIMARY
  const s = shadow || PRIMARY_BG

  return (
    <div style={{
      background: "#fff", borderRadius: 16,
      border: `1px solid ${PRIMARY_BORDER}`,
      boxShadow: SHADOW_SUBTLE, padding: "20px 20px 16px",
      fontFamily: "'DM Sans', sans-serif",
      transition: "transform .15s, box-shadow .15s"
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 24px rgba(14,165,233,.12)` }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = SHADOW_SUBTLE }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: ".08em", textTransform: "uppercase" }}>{title}</div>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: s, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, color: c, lineHeight: 1 }}>{value}</div>
    </div>
  )
}