import { useEffect, useState } from "react"
import api from "../api/axios"
import toast from "react-hot-toast"
import { PRIMARY, PRIMARY_BG, PRIMARY_BORDER } from "../theme/colors"

const getFileIcon = (name = "") => {
  const ext = name.split(".").pop().toLowerCase()
  if (["jpg","jpeg","png","gif","webp"].includes(ext)) return "🖼️"
  if (["pdf"].includes(ext)) return "📄"
  if (["doc","docx"].includes(ext)) return "📝"
  if (["xls","xlsx","csv"].includes(ext)) return "📊"
  if (["zip","rar","7z"].includes(ext)) return "🗜️"
  return "📎"
}

const formatSize = (bytes) => {
  if (!bytes) return ""
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export default function TicketAttachments({ ticketId }) {
  const [files, setFiles]       = useState([])
  const [loadingId, setLoadingId] = useState(null)

  useEffect(() => {
    api.get(`/tickets/${ticketId}/attachments`)
      .then(res => setFiles(res.data))
      .catch(() => toast.error("Gagal load attachment"))
  }, [ticketId])

  const downloadFile = async (fileId, fileName) => {
    setLoadingId(fileId)
    try {
      const res = await api.get(`/tickets/${ticketId}/attachments/${fileId}/download`, { responseType: "blob" })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement("a")
      link.href = url; link.setAttribute("download", fileName)
      document.body.appendChild(link); link.click(); link.remove()
      toast.success("Download berhasil")
    } catch { toast.error("Gagal download file") }
    finally { setLoadingId(null) }
  }

  return (
    <div style={{ background: "#fff", borderRadius: 16, border: `1px solid ${PRIMARY_BORDER}`, boxShadow: "0 1px 8px rgba(0,0,0,.06)", overflow: "hidden", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${PRIMARY_BG}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: PRIMARY, boxShadow: `0 0 0 3px ${PRIMARY_BG}` }} />
          <span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Attachments</span>
        </div>
        {files.length > 0 && (
          <span style={{ fontSize: 12, fontWeight: 600, color: PRIMARY, background: PRIMARY_BG, padding: "2px 10px", borderRadius: 20 }}>
            {files.length} file{files.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div style={{ padding: "14px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
        {files.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px 0", color: "#94a3b8", fontSize: 13 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📭</div>
            No attachments yet
          </div>
        ) : files.map(file => {
          const isLoading = loadingId === file.id
          return (
            <div key={file.id}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${PRIMARY_BORDER}`, background: isLoading ? PRIMARY_BG : "#fafafa", transition: "border-color .15s, background .15s", cursor: isLoading ? "default" : "pointer" }}
              onMouseEnter={e => !isLoading && (e.currentTarget.style.borderColor = PRIMARY)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = PRIMARY_BORDER)}
              onClick={() => !isLoading && downloadFile(file.id, file.file_name)}
            >
              <span style={{ fontSize: 22, flexShrink: 0 }}>{getFileIcon(file.file_name)}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{file.file_name}</div>
                {file.file_size && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{formatSize(file.file_size)}</div>}
              </div>
              <div style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 8, background: isLoading ? PRIMARY_BG : "#f0f9ff", display: "flex", alignItems: "center", justifyContent: "center", color: PRIMARY, fontSize: 14, transition: "background .15s" }}>
                {isLoading ? <span style={{ display: "inline-block", width: 14, height: 14, border: `2px solid ${PRIMARY_BG}`, borderTopColor: PRIMARY, borderRadius: "50%", animation: "spin .7s linear infinite" }} /> : "↓"}
              </div>
            </div>
          )
        })}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}