import { DataGrid } from "@mui/x-data-grid"
import Chip from "@mui/material/Chip"
import Box from "@mui/material/Box"

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
      label={status.replaceAll("_"," ")}
      color={colors[status] || "default"}
      size="small"
    />
  )
}

function PriorityBadge({ priority }) {

  const colors = {
    low:"default",
    medium:"warning",
    high:"error"
  }

  return (
    <Chip
      label={priority}
      color={colors[priority] || "default"}
      size="small"
    />
  )
}

const columns = [

  {
    field:"ticket_code",
    headerName:"Code",
    width:150
  },

  {
    field:"title",
    headerName:"Title",
    flex:1
  },

  {
    field:"current_status",
    headerName:"Status",
    width:200,
    renderCell:(params)=>(
      <StatusBadge status={params.value}/>
    )
  },

  {
    field:"priority",
    headerName:"Priority",
    width:140,
    renderCell:(params)=>(
      <PriorityBadge priority={params.value}/>
    )
  }

]

export default function TicketTable({ tickets }) {

  return (

    <Box sx={{ height:500, width:"100%" }}>

      <DataGrid
        rows={tickets}
        columns={columns}
        pageSizeOptions={[5,10]}
        disableRowSelectionOnClick
        sx={{

          border:0,

          "& .MuiDataGrid-columnHeaders":{
            background:"#f5f7fa",
            fontWeight:600
          },

          "& .MuiDataGrid-row:hover":{
            background:"#f9fbfd"
          }

        }}
      />

    </Box>

  )

}