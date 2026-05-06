import { DataGrid } from "@mui/x-data-grid"
import { useState, useEffect, useRef } from "react"
import Chip from "@mui/material/Chip"
import Tooltip from "@mui/material/Tooltip"

function StatusBadge({ status }) {
  const map = {
    waiting_unit_approval:       { bg: "#fffbeb", color: "#d97706", label: "Waiting Unit" },
    waiting_department_approval: { bg: "#fffbeb", color: "#d97706", label: "Waiting Dept" },
    waiting_pic_assigned:        { bg: "#f5f3ff", color: "#7c3aed", label: "Waiting PIC" },
    waiting_department_review:   { bg: "#f0f9ff", color: "#0284c7", label: "Dept Review" },
    in_progress:                 { bg: "#f0f9ff", color: "#0284c7", label: "In Progress" },
    completed:                   { bg: "#f0fdf4", color: "#16a34a", label: "Completed" },
    rejected:                    { bg: "#fef2f2", color: "#dc2626", label: "Rejected" }
  }
  const cfg = map[status?.toLowerCase()] || { bg: "#f8fafc", color: "#64748b", label: status }
  return (
    <span style={{ padding: "3px 10px", borderRadius: 20, background: cfg.bg, color: cfg.color, fontWeight: 700, fontSize: 11, whiteSpace: "nowrap" }}>
      {cfg.label}
    </span>
  )
}

function PriorityBadge({ priority }) {
  if (!priority) return (
    <Tooltip title="Priority not set">
      <span style={{ padding: "3px 10px", borderRadius: 20, background: "#f8fafc", color: "#94a3b8", border: "1px dashed #cbd5e1", fontWeight: 600, fontSize: 11 }}>Not Set</span>
    </Tooltip>
  )
  const map = { low: ["#f0fdf4","#16a34a"], medium: ["#fffbeb","#d97706"], high: ["#fef2f2","#dc2626"] }
  const [bg, color] = map[priority.toLowerCase()] || ["#f8fafc","#64748b"]
  return <span style={{ padding: "3px 10px", borderRadius: 20, background: bg, color, fontWeight: 700, fontSize: 11, textTransform: "capitalize" }}>{priority}</span>
}

export default function TicketTable({ tickets, onView }) {
  const containerRef = useRef(null)
  const [key, setKey] = useState(0)

  useEffect(() => {
    const obs = new ResizeObserver(() => setKey(k => k + 1))
    if (containerRef.current) obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [])

  const columns = [
    { field: "ticket_code", headerName: "Ticket Code", width: 140,
      renderCell: p => <span style={{ fontWeight: 700, color: "#6366f1", fontSize: 13 }}>{p.value}</span> },
    { field: "unit", headerName: "Unit", width: 140,
      renderCell: p => <span style={{ fontSize: 13, color: "#64748b" }}>{p.row.unit?.name || "-"}</span> },
    { field: "title", headerName: "Title", flex: 1, minWidth: 200,
      renderCell: p => <span style={{ fontWeight: 600, fontSize: 13, color: "#0f172a" }}>{p.value}</span> },
    { field: "current_status", headerName: "Status", width: 160,
      renderCell: p => <StatusBadge status={p.value} /> },
    { field: "priority", headerName: "Priority", width: 120,
      renderCell: p => <PriorityBadge priority={p.value} /> },
    { field: "actions", headerName: "Action", width: 100, sortable: false,
      renderCell: p => (
        <button onClick={e => { e.stopPropagation(); onView(p.row.id) }}
          style={{ padding: "5px 12px", borderRadius: 6, border: "1.5px solid #e0e7ff", background: "#fff", color: "#6366f1", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}
          onMouseEnter={e => (e.currentTarget.style.background = "#eef2ff")}
          onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
        >Detail</button>
      )
    }
  ]

  return (
    <div ref={containerRef} style={{ width: "100%", overflowX: "auto" }}>
      <DataGrid
        key={key}
        rows={tickets}
        columns={columns}
        autoHeight
        pageSizeOptions={[10, 20, 50]}
        disableRowSelectionOnClick
        onRowClick={p => onView(p.row.id)}
        sx={{
          border: 0,
          fontFamily: "'DM Sans', sans-serif",
          "& .MuiDataGrid-columnHeaders": { background: "#f8fafc", fontWeight: 700, borderBottom: "1px solid #e2e8f0", fontSize: 12, letterSpacing: ".04em", textTransform: "uppercase", color: "#64748b" },
          "& .MuiDataGrid-row:hover": { background: "#fafafe", cursor: "pointer" },
          "& .MuiDataGrid-cell": { borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center" },
          "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": { outline: "none" },
          "& .MuiDataGrid-row.Mui-selected": { background: "transparent !important" },
          "& .MuiDataGrid-footerContainer": { borderTop: "1px solid #f1f5f9" }
        }}
      />
    </div>
  )
}