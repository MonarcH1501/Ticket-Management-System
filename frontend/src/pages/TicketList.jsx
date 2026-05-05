// TicketList.jsx - Simple Frontend Filter
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"

import {
  Typography,
  Card,
  Box,
  Button,
  Stack,
  TextField,
  InputAdornment,
  Chip,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress
} from "@mui/material"

import SearchIcon from "@mui/icons-material/Search"
import ClearIcon from "@mui/icons-material/Clear"
import AddIcon from "@mui/icons-material/Add"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import PendingIcon from "@mui/icons-material/Pending"
import TicketTable from "../Components/TicketTable"

export default function TicketList() {
  const [allTickets, setAllTickets] = useState([])
  const [filteredTickets, setFilteredTickets] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState("UNCOMPLETED")
  const [searchTerm, setSearchTerm] = useState("")
  
  const navigate = useNavigate()

  // Fetch all tickets
  useEffect(() => {
    fetchAllTickets()
  }, [])

  // Filter tickets when filter or search changes
  useEffect(() => {
    let filtered = [...allTickets]
    
    // Filter by status
    if (filter === "COMPLETED") {
      filtered = filtered.filter(t => t.current_status === "completed")
    } else if (filter === "UNCOMPLETED") {
      filtered = filtered.filter(t => t.current_status !== "completed")
    }
    
    // Filter by search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(t => 
        t.ticket_code?.toLowerCase().includes(searchLower) ||
        t.title?.toLowerCase().includes(searchLower) ||
        t.unit?.name?.toLowerCase().includes(searchLower)
      )
    }
    
    setFilteredTickets(filtered)
  }, [allTickets, filter, searchTerm])

  const fetchAllTickets = async () => {
    setLoading(true)
    try {
      // Fetch all pages
      const firstPage = await api.get("/tickets?page=1")
      const totalPages = firstPage.data.last_page
      
      let allData = [...(firstPage.data.data ?? firstPage.data)]
      
      for (let page = 2; page <= totalPages; page++) {
        const res = await api.get(`/tickets?page=${page}`)
        allData.push(...(res.data.data ?? res.data))
      }
      
      setAllTickets(allData)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter)
    }
  }

  const clearSearch = () => {
    setSearchTerm("")
  }

  // Hitung jumlah based on status
  const uncompletedCount = allTickets.filter(t => t.current_status !== "completed").length
  const completedCount = allTickets.filter(t => t.current_status === "completed").length

  return (
    <Box sx={{ p: 3, bgcolor: "#f8fafc", minHeight: "100vh" }}>
      
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#0f172a" }}>
            Tickets
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
            Manage all support tickets
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          onClick={() => navigate("/tickets/create")}
          startIcon={<AddIcon />}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            bgcolor: "#3b82f6",
            "&:hover": { bgcolor: "#2563eb" }
          }}
        >
          Create Ticket
        </Button>
      </Stack>

      {/* Filter & Search Bar */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          border: "1px solid #e2e8f0",
          backgroundColor: "white"
        }}
      >
        <Stack spacing={2}>
          {/* Toggle Buttons dengan Badge Counter */}
          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={handleFilterChange}
            sx={{
              "& .MuiToggleButton-root": {
                border: "none",
                px: 3,
                py: 1,
                textTransform: "none",
                fontWeight: 500,
                borderRadius: 2,
                "&.Mui-selected": {
                  bgcolor: filter === "UNCOMPLETED" ? "#3b82f6" : "#10b981",
                  color: "white",
                  "&:hover": { 
                    bgcolor: filter === "UNCOMPLETED" ? "#2563eb" : "#059669" 
                  }
                }
              }
            }}
          >
            <ToggleButton value="UNCOMPLETED">
              <Stack direction="row" spacing={1} alignItems="center">
                <PendingIcon sx={{ fontSize: 18 }} />
                <span>Uncompleted</span>
                <Chip 
                  label={uncompletedCount} 
                  size="small"
                  sx={{ 
                    height: 20,
                    bgcolor: filter === "UNCOMPLETED" ? "rgba(255,255,255,0.2)" : "#e2e8f0",
                    color: filter === "UNCOMPLETED" ? "white" : "#475569"
                  }} 
                />
              </Stack>
            </ToggleButton>

            <ToggleButton value="COMPLETED">
              <Stack direction="row" spacing={1} alignItems="center">
                <CheckCircleIcon sx={{ fontSize: 18 }} />
                <span>Completed</span>
                <Chip 
                  label={completedCount} 
                  size="small"
                  sx={{ 
                    height: 20,
                    bgcolor: filter === "COMPLETED" ? "rgba(255,255,255,0.2)" : "#e2e8f0",
                    color: filter === "COMPLETED" ? "white" : "#475569"
                  }} 
                />
              </Stack>
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Search */}
          <TextField
            fullWidth
            size="small"
            placeholder="Search by ticket code, title, or unit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "#f8fafc"
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#94a3b8" }} />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <ClearIcon 
                    sx={{ cursor: "pointer", color: "#94a3b8" }} 
                    onClick={clearSearch}
                  />
                </InputAdornment>
              )
            }}
          />
        </Stack>
      </Paper>

      {/* Stats */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography sx={{ fontWeight: 500, color: "#475569" }}>
          Showing: <span style={{ fontWeight: 700, color: "#3b82f6" }}>{filteredTickets.length}</span> tickets
          {filteredTickets.length !== allTickets.length && (
            <span style={{ fontSize: "0.875rem", color: "#64748b" }}>
              {" "}(from {allTickets.length} total)
            </span>
          )}
        </Typography>
        
        {searchTerm && (
          <Chip 
            label={`Search: ${searchTerm}`} 
            size="small" 
            onDelete={clearSearch}
            sx={{ borderRadius: 1.5 }}
          />
        )}
      </Stack>

      {/* Table */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          backgroundColor: "white"
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : filteredTickets.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" sx={{ color: "#64748b", mb: 1 }}>
              No tickets found
            </Typography>
            <Typography variant="body2" sx={{ color: "#94a3b8" }}>
              {searchTerm ? "Try different search term" : `No ${filter.toLowerCase()} tickets`}
            </Typography>
          </Box>
        ) : (
          <TicketTable 
            tickets={filteredTickets} 
            onView={(id) => navigate(`/tickets/${id}`)} 
          />
        )}
      </Card>
    </Box>
  )
}