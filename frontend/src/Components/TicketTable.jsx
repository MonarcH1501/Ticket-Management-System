import { DataGrid } from "@mui/x-data-grid"
import Chip from "@mui/material/Chip"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"

function StatusBadge({ status }) {

  const colors = {
    WAITING_UNIT_APPROVAL: "warning",
    WAITING_DEPARTMENT_APPROVAL: "info",
    IN_PROGRESS: "primary",
    COMPLETED: "success",
    REJECTED: "error"
  }

  return (
    <Chip
      label={status.replaceAll("_", " ")}
      color={colors[status] || "default"}
      size="small"
      sx={{ fontWeight: 500 }}
    />
  )
}

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

    {
      field: "ticket_code",
      headerName: "Code",
      width: 150
    },

    {
      field: "title",
      headerName: "Title",
      flex: 1
    },

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
        <Stack
          direction="row"
          alignItems="center"
          sx={{ width: "100%" }}
        >
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

          // HEADER
          "& .MuiDataGrid-columnHeaders": {
            background: "#f8fafc",
            fontWeight: 600
          },

          // ROW
          "& .MuiDataGrid-row": {
            transition: "0.2s"
          },

          "& .MuiDataGrid-row:hover": {
            background: "#f1f5f9",
            cursor: "pointer"
          },

          // ✅ FIX: CENTER SEMUA ISI
          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid #f1f5f9"
          },

          // REMOVE BLUE OUTLINE
          "& .MuiDataGrid-cell:focus": {
            outline: "none"
          },

          "& .MuiDataGrid-cell:focus-within": {
            outline: "none"
          },

          // REMOVE SELECT EFFECT
          "& .MuiDataGrid-row.Mui-selected": {
            background: "transparent !important"
          },

          // ACTION COLUMN GA IKUT HOVER
          "& .MuiDataGrid-row:hover .MuiDataGrid-cell:last-child": {
            background: "transparent"
          }

        }}
      />

    </Box>

  )

}