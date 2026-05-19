// src/theme/colors.js
// ─────────────────────────────────────────────────────────────────
// GANTI WARNA DISINI — semua komponen otomatis ikut
// ─────────────────────────────────────────────────────────────────

// ── Primary brand color ───────────────────────────────────────────
export const PRIMARY        = "#1e40af"   // main
export const PRIMARY_DARK   = "#1e3a8a"   // darker variant
export const PRIMARY_LIGHT  = "#3b82f6"   // lighter variant
export const PRIMARY_BG     = "#eff6ff"   // background tint
export const PRIMARY_BORDER = "#bfdbfe"   // border
export const PRIMARY_TEXT   = "#1d4ed8"   // text on light bg
export const PRIMARY_DEEP   = "#1e3a8a"   // deepest (sidebar, headers)

// ── Gradients ─────────────────────────────────────────────────────
export const GRADIENT         = `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})`
export const GRADIENT_SIDEBAR = `linear-gradient(180deg, ${PRIMARY_DEEP} 0%, ${PRIMARY} 100%)`

// ── Shadow ────────────────────────────────────────────────────────
export const SHADOW        = `0 4px 14px rgba(30,64,175,0.35)`
export const SHADOW_SUBTLE = `0 1px 8px rgba(0,0,0,.06)`

// ── Page background ───────────────────────────────────────────────
export const PAGE_BG = "#eff6ff"

// ── Focus ring (for inputs) ───────────────────────────────────────
export const FOCUS_COLOR = PRIMARY

// ── Status colors — jangan diubah kecuali memang mau ganti arti ──
export const STATUS = {
  waiting_unit_approval:       { color: "#d97706", bg: "#fffbeb", label: "Waiting Unit"         },
  waiting_department_approval: { color: "#d97706", bg: "#fffbeb", label: "Waiting Dept Approval" },
  waiting_pic_assigned:        { color: "#7c3aed", bg: "#f5f3ff", label: "Waiting PIC"           },
  in_progress:                 { color: PRIMARY,   bg: PRIMARY_BG,label: "In Progress"           },
  waiting_department_review:   { color: PRIMARY_DARK, bg: PRIMARY_BG, label: "Dept Review"       },
  completed:                   { color: "#16a34a", bg: "#f0fdf4", label: "Completed"             },
  rejected:                    { color: "#dc2626", bg: "#fef2f2", label: "Rejected"              },
  forwarded:                   { color: "#f59e0b", bg: "#fffbeb", label: "Forwarded"             },
}

export const PRIORITY = {
  high:   { color: "#dc2626", bg: "#fef2f2", label: "High"   },
  medium: { color: "#d97706", bg: "#fffbeb", label: "Medium" },
  low:    { color: "#16a34a", bg: "#f0fdf4", label: "Low"    },
}