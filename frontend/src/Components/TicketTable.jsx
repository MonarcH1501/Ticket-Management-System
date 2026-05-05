import { DataGrid } from "@mui/x-data-grid"
import Chip from "@mui/material/Chip"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"

// ✅ STATUS (simple kayak priority)
function StatusBadge({ status }) {

  const s = status?.toLowerCase()

  const colors = {
    waiting_unit_approval: "warning",
    waiting_department_approval: "warning",
    waiting_pic_assigned: "warning",
    in_progress: "info",
    completed: "success",
    rejected: "error"
  }

  return (
    <Chip
      label={s?.replaceAll("_", " ")}
      color={colors[s] || "default"}
      size="small"
      sx={{ fontWeight: 500, textTransform: "capitalize" }}
    />
  )
}

// ✅ PRIORITY (tetap)
function PriorityBadge({ priority }) {

  const colors = {
    low: "default",
    medium: "warning",
    high: "error"
  }

  return (
    <Chip
      label={priority}
      color={colors[priority] || "default"}
      size="small"
      sx={{ textTransform: "capitalize" }}
    />
  )
}

export default function TicketTable({ tickets, onView }) {

  const columns = [

    { field: "ticket_code", headerName: "Code", width: 150 },
    { field: "title", headerName: "Title", flex: 1 },

    {
      field: "current_status",
      headerName: "Status",
      width: 220,
      renderCell: (params) => (
        <StatusBadge status={params.value} />
      )
    },

    {
      field: "priority",
      headerName: "Priority",
      width: 140,
      renderCell: (params) => (
        <PriorityBadge priority={params.value} />
      )
    },

    {
      field: "actions",
      headerName: "Action",
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" sx={{ width: "100%" }}>
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
              color: "#2563eb",
              minWidth: "auto",
              padding: 0,
              "&:hover": {
                background: "transparent",
                textDecoration: "underline"
              }
            }}
          >
            Detail
          </Button>
        </Stack>
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
          borderRadius: 3,

          "& .MuiDataGrid-columnHeaders": {
            background: "#f8fafc",
            fontWeight: 600
          },

          "& .MuiDataGrid-row:hover": {
            background: "#f1f5f9",
            cursor: "pointer"
          },

          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
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