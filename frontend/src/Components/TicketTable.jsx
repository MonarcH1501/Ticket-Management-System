import { DataGrid } from "@mui/x-data-grid"
import { useState, useEffect, useRef } from "react"
import { Tooltip } from "@mui/material"
import { PRIMARY, PRIMARY_BG, PRIMARY_BORDER, STATUS, PRIORITY } from "../theme/colors"

function StatusBadge({ status }) {
  const cfg = STATUS[status?.toLowerCase()] || { bg: "#f8fafc", color: "#64748b", label: status }
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
  const cfg = PRIORITY[priority.toLowerCase()] || { bg: "#f8fafc", color: "#64748b", label: priority }
  return <span style={{ padding: "3px 10px", borderRadius: 20, background: cfg.bg, color: cfg.color, fontWeight: 700, fontSize: 11, textTransform: "capitalize" }}>{cfg.label}</span>
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
      renderCell: p => <span style={{ fontWeight: 700, color: PRIMARY, fontSize: 13 }}>{p.value}</span> },
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
          style={{ padding: "5px 12px", borderRadius: 6, border: `1.5px solid ${PRIMARY_BORDER}`, background: "#fff", color: PRIMARY, fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}
          onMouseEnter={e => (e.currentTarget.style.background = PRIMARY_BG)}
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
          "& .MuiDataGrid-columnHeaders": { background: "#f0f9ff", fontWeight: 700, borderBottom: `1px solid ${PRIMARY_BORDER}`, fontSize: 12, letterSpacing: ".04em", textTransform: "uppercase", color: "#64748b" },
          "& .MuiDataGrid-row:hover": { background: "#f0f9ff", cursor: "pointer" },
          "& .MuiDataGrid-cell": { borderBottom: `1px solid ${PRIMARY_BORDER}`, display: "flex", alignItems: "center" },
          "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": { outline: "none" },
          "& .MuiDataGrid-row.Mui-selected": { background: "transparent !important" },
          "& .MuiDataGrid-footerContainer": { borderTop: `1px solid ${PRIMARY_BORDER}` }
        }}
      />
    </div>
  )
}