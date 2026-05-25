import { useEffect, useState } from "react"
import api from "../api/axios"
import toast from "react-hot-toast"
import { PRIMARY, PRIMARY_BG, PRIMARY_BORDER, PRIMARY_TEXT, PRIMARY_DEEP } from "../theme/colors"

const STAGE_CONFIG = {
  initial:     { label: "Initial",     emoji: "📋", color: PRIMARY,     bg: PRIMARY_BG,  border: PRIMARY_BORDER },
  in_progress: { label: "In Progress", emoji: "⚙️",  color: "#d97706",  bg: "#fffbeb",   border: "#fde68a"      },
  approval:    { label: "Approval",    emoji: "✅",  color: "#7c3aed",  bg: "#f5f3ff",   border: "#ddd6fe"      },
  complete:    { label: "Complete",    emoji: "🏁",  color: "#16a34a",  bg: "#f0fdf4",   border: "#bbf7d0"      },
}

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
  const [grouped, setGrouped]     = useState({})
  const [loading, setLoading]     = useState(true)
  const [loadingId, setLoadingId] = useState(null)
  const totalFiles = Object.values(grouped).flat().length

  useEffect(() => {
    setLoading(true)
    api.get(`/tickets/${ticketId}/attachments`)
      .then(res => setGrouped(res.data))
      .catch(() => toast.error("Gagal load attachment"))
      .finally(() => setLoading(false))
  }, [ticketId])

  const downloadFile = async (fileId, fileName) => {
    setLoadingId(fileId)
    try {
      const res = await api.get(`/tickets/${ticketId}/attachments/${fileId}/download`, { responseType: "blob" })
      const url  = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", fileName)
      document.body.appendChild(link); link.click(); link.remove()
      toast.success("Download berhasil")
    } catch {
      toast.error("Gagal download file")
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div style={{ background: "#fff", borderRadius: 16, border: `1px solid ${PRIMARY_BORDER}`, boxShadow: "0 1px 8px rgba(0,0,0,.06)", overflow: "hidden", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${PRIMARY_BG}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: PRIMARY, boxShadow: `0 0 0 3px ${PRIMARY_BG}` }} />
          <span style={{ fontWeight: 700, fontSize: 14, color: PRIMARY_DEEP }}>Attachments</span>
        </div>
        {totalFiles > 0 && (
          <span style={{ fontSize: 12, fontWeight: 600, color: PRIMARY_TEXT, background: PRIMARY_BG, padding: "2px 10px", borderRadius: 20 }}>
            {totalFiles} file{totalFiles > 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "24px 0", color: "#94a3b8", fontSize: 13 }}>
            <span style={{ display: "inline-block", width: 18, height: 18, border: `2px solid ${PRIMARY_BORDER}`, borderTopColor: PRIMARY, borderRadius: "50%", animation: "spin .7s linear infinite", marginBottom: 10 }} />
            <div>Loading attachments...</div>
          </div>
        ) : totalFiles === 0 ? (
          <div style={{ textAlign: "center", padding: "24px 0", color: "#94a3b8", fontSize: 13 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📭</div>
            No attachments yet
          </div>
        ) : (
          Object.entries(STAGE_CONFIG).map(([stageKey, cfg]) => {
            const files = grouped[stageKey]
            if (!files || files.length === 0) return null
            return (
              <div key={stageKey}>
                {/* Stage header */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 14 }}>{cfg.emoji}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color, textTransform: "uppercase", letterSpacing: ".06em" }}>{cfg.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: cfg.color, background: cfg.bg, padding: "1px 8px", borderRadius: 20, border: `1px solid ${cfg.border}` }}>
                    {files.length}
                  </span>
                  <div style={{ flex: 1, height: 1, background: cfg.border }} />
                </div>

                {/* Files in this stage */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {files.map(file => {
                    const isLoading = loadingId === file.id
                    return (
                      <div key={file.id}
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${isLoading ? cfg.color : cfg.border}`, background: isLoading ? cfg.bg : "#fafafa", transition: "border-color .15s, background .15s", cursor: isLoading ? "default" : "pointer" }}
                        onMouseEnter={e => !isLoading && (e.currentTarget.style.borderColor = cfg.color)}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = cfg.border)}
                        onClick={() => !isLoading && downloadFile(file.id, file.file_name)}
                      >
                        <span style={{ fontSize: 20, flexShrink: 0 }}>{getFileIcon(file.file_name)}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: PRIMARY_DEEP, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{file.file_name}</div>
                          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2, display: "flex", gap: 8 }}>
                            {file.file_size && <span>{formatSize(file.file_size)}</span>}
                            {file.uploader?.name && <span>· {file.uploader.name}</span>}
                          </div>
                        </div>
                        <div style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 8, background: isLoading ? cfg.bg : PRIMARY_BG, display: "flex", alignItems: "center", justifyContent: "center", color: cfg.color, fontSize: 14, transition: "background .15s" }}>
                          {isLoading
                            ? <span style={{ display: "inline-block", width: 14, height: 14, border: `2px solid ${cfg.border}`, borderTopColor: cfg.color, borderRadius: "50%", animation: "spin .7s linear infinite" }} />
                            : "↓"
                          }
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
