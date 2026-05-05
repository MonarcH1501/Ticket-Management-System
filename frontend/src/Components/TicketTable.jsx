// TicketTable.jsx - Full improved version
import { DataGrid } from "@mui/x-data-grid"
import Chip from "@mui/material/Chip"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Tooltip from "@mui/material/Tooltip"
import FlagIcon from "@mui/icons-material/Flag"
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"
import CircleIcon from "@mui/icons-material/Circle"

function StatusBadge({ status }) {
  const s = status?.toLowerCase()

  const statusConfig = {
    waiting_unit_approval: { color: "warning", label: "Waiting Unit Approval", icon: "⏳" },
    waiting_department_approval: { color: "warning", label: "Waiting Dept Approval", icon: "⏳" },
    waiting_pic_assigned: { color: "warning", label: "Waiting PIC Assigned", icon: "⏳" },
    in_progress: { color: "info", label: "In Progress", icon: "🔄" },
    completed: { color: "success", label: "Completed", icon: "✅" },
    rejected: { color: "error", label: "Rejected", icon: "❌" }
  }

  const config = statusConfig[s] || { color: "default", label: s, icon: "📋" }

  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      sx={{ 
        fontWeight: 500, 
        textTransform: "capitalize",
        "& .MuiChip-label": {
          display: "flex",
          alignItems: "center",
          gap: 0.5
        }
      }}
    />
  )
}

function PriorityBadge({ priority }) {
  // Handle empty priority
  if (!priority || priority === "") {
    return (
      <Tooltip title="Priority not set">
        <Chip
          icon={<HelpOutlineIcon sx={{ fontSize: 14 }} />}
          label="Not Set"
          size="small"
          sx={{ 
            bgcolor: "#f8fafc",
            color: "#94a3b8",
            border: "1px dashed #cbd5e1",
            fontWeight: 400,
            fontStyle: "italic",
            "& .MuiChip-icon": {
              color: "#94a3b8",
              fontSize: 14
            }
          }}
        />
      </Tooltip>
    )
  }

  const priorityConfig = {
    low: { 
      bg: "#dcfce7", 
      color: "#166534", 
      label: "Low",
      icon: <CircleIcon sx={{ fontSize: 12, color: "#16a34a" }} />
    },
    medium: { 
      bg: "#fef3c7", 
      color: "#92400e", 
      label: "Medium",
      icon: <CircleIcon sx={{ fontSize: 12, color: "#d97706" }} />
    },
    high: { 
      bg: "#fee2e2", 
      color: "#991b1b", 
      label: "High",
      icon: <CircleIcon sx={{ fontSize: 12, color: "#dc2626" }} />
    }
  }

  const config = priorityConfig[priority]

  return (
    <Tooltip title={`${config.label} Priority`}>
      <Chip
        icon={config.icon}
        label={config.label}
        size="small"
        sx={{ 
          bgcolor: config.bg,
          color: config.color,
          fontWeight: 600,
          "& .MuiChip-icon": {
            marginLeft: 1
          }
        }}
      />
    </Tooltip>
  )
}

export default function TicketTable({ tickets, onView }) {
  const columns = [
    { field: "ticket_code", headerName: "Ticket Code", width: 150 },
    {
      field: "unit",
      headerName: "Unit",
      width: 150,
      renderCell: (params) => {
        const unitName = params.row.unit?.name;
        return <span>{unitName || "-"}</span>;
      }
    },
    { field: "title", headerName: "Title", width:350},
    {
      field: "current_status",
      headerName: "Status",
      width: 200,
      renderCell: (params) => <StatusBadge status={params.value} />
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 120,
      renderCell: (params) => <PriorityBadge priority={params.value} />
    },
    {
      field: "actions",
      headerName: "Action",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="text"
          size="small"
          onClick={(e) => {
            e.stopPropagation()
            onView(params.row.id)
          }}
          sx={{
            textTransform: "none",
            fontWeight: 500,
            color: "#3b82f6",
            "&:hover": {
              bgcolor: "#eff6ff",
              textDecoration: "none"
            }
          }}
        >
          Detail
        </Button>
      )
    }
  ]

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        rows={tickets}
        columns={columns}
        autoHeight
        pageSizeOptions={[5, 10, 20]}
        disableRowSelectionOnClick
        onRowClick={(params) => onView(params.row.id)}
        sx={{
          border: 0,
          borderRadius: 2,
          "& .MuiDataGrid-columnHeaders": {
            background: "#f8fafc",
            fontWeight: 600,
            borderBottom: "1px solid #e2e8f0"
          },
          "& .MuiDataGrid-row:hover": {
            background: "#f8fafc",
            cursor: "pointer"
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid #f1f5f9"
          },
          "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
            outline: "none"
          },
          "& .MuiDataGrid-row.Mui-selected": {
            background: "transparent !important"
          }
        }}
      />
    </Box>
  )
}