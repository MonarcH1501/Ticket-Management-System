import { useParams } from "react-router-dom"
import { useEffect, useState, useCallback } from "react"
import api from "../api/axios"

import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
  Paper,
  LinearProgress,
  Alert,
  Button
} from "@mui/material"

import {
  ArrowBack,
  AttachFile,
  AccessTime,
  Flag,
  Person,
  Category,
  Business,
  CheckCircle,
  Schedule,
  Timeline,
  Description,
  Download
} from "@mui/icons-material"

import TicketActions from "../Components/TicketActions"
import TicketWorkflow from "../Components/TicketWorkflow"
import TicketAttachments from "../Components/TicketAttachments"

export default function TicketDetail() {
  const { id } = useParams()
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentUser, setCurrentUser] = useState(null) // State untuk user saat ini
  const [canApprove, setCanApprove] = useState(false) // State untuk mengecek akses approve

  const fetchTicket = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await api.get(`/tickets/${id}`)
      setTicket(res.data.data ?? res.data)
    } catch (err) {
      console.error(err)
      setError("Failed to load ticket details")
    } finally {
      setLoading(false)
    }
  }, [id])

  // Fetch current user data  
  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await api.get('/user') // Endpoint user profile
      setCurrentUser(res.data.data ?? res.data)
    } catch (err) {
      console.error("Failed to fetch current user:", err)
    }
  }, [])

    // Check if current user can approve this ticket
  const checkCanApprove = useCallback(() => {
    if (!ticket || !currentUser) return false

    // Cek berdasarkan status ticket dan user role
    const status = ticket.current_status?.toLowerCase()
    
    // User dapat approve jika:
    // 1. Status ticket adalah waiting approval atau waiting department approval
    // 2. User adalah approver yang ditunjuk (current_approver_id)
    // 3. Atau user memiliki role yang sesuai (kepala_unit/kepala_department)
    
    const isWaitingApproval = status === 'waiting_unit_approval' || 
                              status === 'waiting_department_approval'
    
    const isDesignatedApprover = ticket.current_approver_id === currentUser.id
    
    const hasPendingApprovalRole = ticket.approvals?.some(approval => 
      approval.status === 'pending' && 
      approval.approver?.id === currentUser.id
    )
    
    return isWaitingApproval && (isDesignatedApprover || hasPendingApprovalRole)
  }, [ticket, currentUser])

  useEffect(() => {
    fetchCurrentUser()
  }, [fetchCurrentUser])

  useEffect(() => {
    if (ticket && currentUser) {
      setCanApprove(checkCanApprove())
    }
  }, [ticket, currentUser, checkCanApprove])

  useEffect(() => {
    fetchTicket()
  }, [fetchTicket])

  const getStatusConfig = (status) => {
    const s = status?.toLowerCase()
    const configs = {
      waiting_approval: { color: "#ed6c02", bg: "#fff4e5", icon: <Schedule sx={{ fontSize: 14 }} />, label: "Waiting Approval" },
      waiting_department_approval: { color: "#ed6c02", bg: "#fff4e5", icon: <Schedule sx={{ fontSize: 14 }} />, label: "Waiting Department Approval" },
      in_progress: { color: "#0288d1", bg: "#e3f2fd", icon: <Timeline sx={{ fontSize: 14 }} />, label: "In Progress" },
      done: { color: "#2e7d32", bg: "#e8f5e9", icon: <CheckCircle sx={{ fontSize: 14 }} />, label: "Done" },
      rejected: { color: "#d32f2f", bg: "#ffebee", icon: <Flag sx={{ fontSize: 14 }} />, label: "Rejected" }
    }
    return configs[s] || { color: "#757575", bg: "#f5f5f5", icon: null, label: s?.replace(/_/g, " ") || "Unknown" }
  }

  const formatDate = (date) => {
    if (!date) return "-"
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const getPriorityColor = (priority) => {
    const p = priority?.toLowerCase()
    if (p === "high") return "#d32f2f"
    if (p === "medium") return "#ed6c02"
    if (p === "low") return "#2e7d32"
    return "#757575"
  }

  const getPriorityIcon = (priority) => {
    const p = priority?.toLowerCase()
    if (p === "high") return <Flag sx={{ fontSize: 16 }} />
    if (p === "medium") return <Flag sx={{ fontSize: 16 }} />
    return <Flag sx={{ fontSize: 16 }} />
  }
  
  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Typography color="text.secondary">Loading ticket details...</Typography>
        </Box>
      </Box>
    )
  }

  if (error || !ticket) {
    return (
      <Box sx={{ p: 3, maxWidth: 600, mx: "auto", mt: 5 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error || "Ticket not found"}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => window.history.back()}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Box>
    )
  }

  const statusConfig = getStatusConfig(ticket.current_status)
  const priorityColor = getPriorityColor(ticket.priority)

  return (
    <Box sx={{ 
      minHeight: "100vh",
      bgcolor: "#f8f9fa",
      py: 4,
      px: { xs: 2, sm: 3, md: 4 }
    }}>
      {/* Header Section */}
      <Box sx={{ maxWidth: 1400, mx: "auto", mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <IconButton 
            onClick={() => window.history.back()}
            sx={{ bgcolor: "white", boxShadow: 1 }}
          >
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 1 }}>
              TICKET DETAILS
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}>
              {ticket.title}
            </Typography>
          </Box>
        </Stack>

        {/* Quick Info Cards */}
        <Box sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
          gap: 2,
          mb: 3
        }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: "white", border: "1px solid #e0e0e0" }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Avatar sx={{ bgcolor: "#e3f2fd", width: 40, height: 40 }}>
                <Business sx={{ fontSize: 20, color: "#1976d2" }} />
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary">Ticket Code</Typography>
                <Typography fontWeight={600} fontSize={14}>{ticket.ticket_code}</Typography>
              </Box>
            </Stack>
          </Paper>

          <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: "white", border: "1px solid #e0e0e0" }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Avatar sx={{ bgcolor: "#fff4e5", width: 40, height: 40 }}>
                <Category sx={{ fontSize: 20, color: "#ed6c02" }} />
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary">Category</Typography>
                <Typography fontWeight={600} fontSize={14}>{ticket.category?.name || "-"}</Typography>
              </Box>
            </Stack>
          </Paper>

          <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: "white", border: "1px solid #e0e0e0" }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Avatar sx={{ bgcolor: "#e8f5e9", width: 40, height: 40 }}>
                <Person sx={{ fontSize: 20, color: "#2e7d32" }} />
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary">Created By</Typography>
                <Typography fontWeight={600} fontSize={14}>{ticket.creator?.name || "-"}</Typography>
                <Typography variant="caption" color="text.secondary">{ticket.department?.name || "-"}</Typography>
              </Box>
            </Stack>
          </Paper>

          <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: "white", border: "1px solid #e0e0e0" }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Avatar sx={{ bgcolor: statusConfig.bg, width: 40, height: 40 }}>
                {statusConfig.icon}
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary">Status</Typography>
                <Chip 
                  label={statusConfig.label}
                  size="small"
                  sx={{ 
                    bgcolor: statusConfig.bg,
                    color: statusConfig.color,
                    fontWeight: 600,
                    fontSize: 12,
                    height: 24
                  }}
                />
              </Box>
            </Stack>
          </Paper>
        </Box>
      </Box>

      {/* Main Content Grid */}
      <Box sx={{ maxWidth: 1400, mx: "auto" }}>
        <Box sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
          gap: 3
        }}>
          
          {/* Left Column - Main Content */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            
            {/* Description Card */}
            <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #e0e0e0" }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Description sx={{ color: "#1976d2" }} />
                  <Typography variant="h6" fontWeight={600}>Description</Typography>
                </Stack>
                <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {ticket.description || "No description provided"}
                </Typography>
              </CardContent>
            </Card>

            {/* Details Grid */}
            <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #e0e0e0" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>Details</Typography>
                <Box sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                  gap: 3
                }}>
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <Flag sx={{ fontSize: 18, color: priorityColor }} />
                      <Typography variant="subtitle2" color="text.secondary">Priority</Typography>
                    </Stack>
                    <Chip 
                      icon={getPriorityIcon(ticket.priority)}
                      label={ticket.priority?.toUpperCase() || "-"}
                      size="small"
                      sx={{ 
                        bgcolor: `${priorityColor}10`,
                        color: priorityColor,
                        fontWeight: 600
                      }}
                    />
                  </Box>

                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <AccessTime sx={{ fontSize: 18, color: "#757575" }} />
                      <Typography variant="subtitle2" color="text.secondary">Due Date</Typography>
                    </Stack>
                    <Typography fontWeight={500}>
                      {ticket.due_date ? formatDate(ticket.due_date) : "Not set"}
                    </Typography>
                  </Box>

                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <Person sx={{ fontSize: 18, color: "#757575" }} />
                      <Typography variant="subtitle2" color="text.secondary">PIC</Typography>
                    </Stack>
                    <Typography fontWeight={500}>
                      {ticket.pic?.name || "Not assigned"}
                    </Typography>
                  </Box>

                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <Business sx={{ fontSize: 18, color: "#757575" }} />
                      <Typography variant="subtitle2" color="text.secondary">Department</Typography>
                    </Stack>
                    <Typography fontWeight={500}>
                      {ticket.department?.name || "-"}
                    </Typography>
                  </Box>

                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <Category sx={{ fontSize: 18, color: "#757575" }} />
                      <Typography variant="subtitle2" color="text.secondary">Category</Typography>
                    </Stack>
                    <Typography fontWeight={500}>
                      {ticket.category?.name || "-"}
                    </Typography>
                  </Box>

                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <Schedule sx={{ fontSize: 18, color: "#757575" }} />
                      <Typography variant="subtitle2" color="text.secondary">Created At</Typography>
                    </Stack>
                    <Typography fontWeight={500}>
                      {formatDate(ticket.created_at)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Approvals History */}
            {ticket.approvals && ticket.approvals.length > 0 && (
              <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #e0e0e0" }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>Approval History</Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {ticket.approvals.map((approval, index) => (
                      <Box key={approval.id}>
                        <Box sx={{
                          display: "grid",
                          gridTemplateColumns: { xs: "1fr", sm: "auto 1fr auto" },
                          gap: 2,
                          alignItems: "start"
                        }}>
                          <Avatar sx={{ bgcolor: approval.status === "approved" ? "#e8f5e9" : "#ffebee", width: 40, height: 40 }}>
                            {approval.status === "approved" ? 
                              <CheckCircle sx={{ fontSize: 20, color: "#2e7d32" }} /> : 
                              approval.status === "pending" ?
                              <Schedule sx={{ fontSize: 20, color: "#ed6c02" }} /> :
                              <Flag sx={{ fontSize: 20, color: "#d32f2f" }} />
                            }
                          </Avatar>
                          <Box>
                            <Typography fontWeight={600}>
                              {approval.role_as?.replace(/_/g, " ").toUpperCase()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              By: {approval.approver?.name || "-"}
                            </Typography>
                            {approval.notes && (
                              <Typography variant="body2" sx={{ mt: 0.5, color: "text.secondary" }}>
                                Note: {approval.notes}
                              </Typography>
                            )}
                          </Box>
                          <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                            {approval.approved_at ? formatDate(approval.approved_at) : "Pending"}
                          </Typography>
                        </Box>
                        {index < ticket.approvals.length - 1 && <Divider sx={{ mt: 2 }} />}
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}

            <TicketAttachments ticketId={id} />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {(canApprove || ticket.current_status === "waiting_pic_assigned"  ||
            (ticket.current_status === "in_progress" && Number(currentUser?.id) === Number(ticket?.pic_id || ticket?.pic?.id) || 
            ticket.current_status === "waiting_department_review")) && (
              <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #e0e0e0"  , top: 20 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Actions Required
                  </Typography>
                  <TicketActions ticket={ticket} refresh={fetchTicket} />
                </CardContent>
              </Card>
            )}

            {/* Workflow Timeline */}
            <TicketWorkflow ticketId={id} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}