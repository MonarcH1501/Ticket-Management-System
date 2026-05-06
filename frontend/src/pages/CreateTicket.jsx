import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import TicketForm from "../Components/TicketForm"

export default function CreateTicket() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleCreate = async (form, files) => {
    try {
      setLoading(true)

      // 1. Buat ticket
      const res = await api.post("/tickets", form)
      const ticketId = res.data.data.id

      // 2. Upload file satu per satu (backend hanya terima 1 file per request)
      if (files && files.length > 0) {
        const results = await Promise.allSettled(
          files.map(file => {
            const fd = new FormData()
            fd.append("file", file)
            return api.post(`/tickets/${ticketId}/attachments`, fd, {
              headers: { "Content-Type": "multipart/form-data" }
            })
          })
        )

        const failed = results.filter(r => r.status === "rejected")
        if (failed.length > 0) {
          alert(`Ticket berhasil dibuat, tapi ${failed.length} file gagal diupload. Coba upload ulang di halaman detail ticket.`)
        }
      }

      navigate("/tickets/alltickets")
    } catch (err) {
      console.error(err)
      alert("Failed to create ticket")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 4 }}>Ticketing</div>
        <div style={{ fontSize: 24, fontWeight: 800, color: "#0f172a" }}>Create Ticket</div>
        <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Submit a new support ticket to the relevant department</div>
      </div>

      {/* Card */}
      <div style={{
        background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0",
        boxShadow: "0 1px 8px rgba(0,0,0,.06)", padding: "28px 32px"
      }}>
        <TicketForm onSubmit={handleCreate} loading={loading} />
      </div>
    </div>
  )
}