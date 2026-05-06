import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import { CircularProgress } from "@mui/material"
import TicketTable from "../Components/TicketTable"

export default function TicketList() {
  const [allTickets, setAllTickets]           = useState([])
  const [filteredTickets, setFilteredTickets] = useState([])
  const [loading, setLoading]                 = useState(false)
  const [filter, setFilter]                   = useState("UNCOMPLETED")
  const [searchTerm, setSearchTerm]           = useState("")
  const navigate = useNavigate()

  // ── Fetch ALL pages ──────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        const first = await api.get("/tickets?page=1")
        const totalPages = first.data.last_page ?? 1
        let all = [...(first.data.data ?? first.data)]
        for (let p = 2; p <= totalPages; p++) {
          const res = await api.get(`/tickets?page=${p}`)
          all.push(...(res.data.data ?? res.data))
        }
        setAllTickets(all)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  // ── Filter + Search ──────────────────────────────────────────────────────────
  useEffect(() => {
    let result = [...allTickets]
    if (filter === "COMPLETED")   result = result.filter(t => t.current_status === "completed")
    if (filter === "UNCOMPLETED") result = result.filter(t => t.current_status !== "completed")
    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      result = result.filter(t =>
        t.ticket_code?.toLowerCase().includes(q) ||
        t.title?.toLowerCase().includes(q) ||
        t.unit?.name?.toLowerCase().includes(q)
      )
    }
    setFilteredTickets(result)
  }, [allTickets, filter, searchTerm])

  const uncompletedCount = allTickets.filter(t => t.current_status !== "completed").length
  const completedCount   = allTickets.filter(t => t.current_status === "completed").length

  const tabBtn = (active, activeColor = "#6366f1", activeBg = "#eef2ff") => ({
    display: "flex", alignItems: "center", gap: 8,
    padding: "8px 16px", borderRadius: 20, border: "none",
    background: active ? activeBg : "transparent",
    color: active ? activeColor : "#94a3b8",
    fontWeight: 700, fontSize: 13, cursor: "pointer",
    fontFamily: "inherit", transition: "all .15s"
  })

  return (
    <div style={{ padding: "28px 24px", fontFamily: "'DM Sans', sans-serif" }}>

      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 4 }}>Ticketing</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>Tickets</div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>Manage all support tickets</div>
        </div>
        <button onClick={() => navigate("/tickets/create")} style={{
          padding: "10px 20px", borderRadius: 10, border: "none",
          background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff",
          fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
          boxShadow: "0 4px 14px rgba(99,102,241,.3)"
        }}>
          + Create Ticket
        </button>
      </div>

      {/* Main Card */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", boxShadow: "0 1px 8px rgba(0,0,0,.06)", overflow: "hidden" }}>

        {/* Toolbar */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>

          {/* Filter Tabs */}
          <div style={{ display: "flex", background: "#f8fafc", borderRadius: 22, padding: 3, gap: 2 }}>
            <button style={tabBtn(filter === "UNCOMPLETED")} onClick={() => setFilter("UNCOMPLETED")}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: filter === "UNCOMPLETED" ? "#6366f1" : "#cbd5e1" }} />
              Uncompleted
              <span style={{ padding: "1px 7px", borderRadius: 20, background: filter === "UNCOMPLETED" ? "#6366f1" : "#e2e8f0", color: filter === "UNCOMPLETED" ? "#fff" : "#94a3b8", fontSize: 11, fontWeight: 700 }}>
                {uncompletedCount}
              </span>
            </button>
            <button style={tabBtn(filter === "COMPLETED", "#22c55e", "#f0fdf4")} onClick={() => setFilter("COMPLETED")}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: filter === "COMPLETED" ? "#22c55e" : "#cbd5e1" }} />
              Completed
              <span style={{ padding: "1px 7px", borderRadius: 20, background: filter === "COMPLETED" ? "#22c55e" : "#e2e8f0", color: filter === "COMPLETED" ? "#fff" : "#94a3b8", fontSize: 11, fontWeight: 700 }}>
                {completedCount}
              </span>
            </button>
          </div>

          {/* Search */}
          <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: 14 }}>🔍</span>
            <input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by ticket code, title, or unit..."
              style={{ width: "100%", padding: "8px 36px 8px 34px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box", background: "#fafafa" }}
              onFocus={e => (e.target.style.borderColor = "#6366f1")}
              onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
            />
            {searchTerm && (
              <span onClick={() => setSearchTerm("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#94a3b8", fontSize: 18, lineHeight: 1 }}>×</span>
            )}
          </div>

          {/* Counter */}
          <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, whiteSpace: "nowrap" }}>
            Showing{" "}
            <span style={{ color: "#6366f1" }}>{filteredTickets.length}</span>
            {" "}of{" "}
            <span style={{ color: "#6366f1" }}>{filter === "COMPLETED" ? completedCount : uncompletedCount}</span>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
            <CircularProgress sx={{ color: "#6366f1" }} />
          </div>
        ) : filteredTickets.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 24px", color: "#94a3b8" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>👀</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#475569", marginBottom: 4 }}>No tickets found</div>
            <div style={{ fontSize: 13 }}>{searchTerm ? "Try a different search term" : `No ${filter.toLowerCase()} tickets`}</div>
          </div>
        ) : (
          <TicketTable tickets={filteredTickets} onView={id => navigate(`/tickets/${id}`)} />
        )}
      </div>
    </div>
  )
}