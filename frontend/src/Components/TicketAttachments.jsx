import { useEffect, useState } from "react"
import api from "../api/axios"
import toast from "react-hot-toast"

import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  CircularProgress
} from "@mui/material"

export default function TicketAttachments({ ticketId }) {

  const [files, setFiles] = useState([])
  const [loadingId, setLoadingId] = useState(null)

  useEffect(() => {

    api.get(`/tickets/${ticketId}/attachments`)
      .then(res => {
        setFiles(res.data)
      })
      .catch(() => {
        toast.error("Gagal load attachment")
      })

  }, [ticketId])

  const downloadFile = async (fileId, fileName) => {

    setLoadingId(fileId)

    try {

      const res = await api.get(
        `/tickets/${ticketId}/attachments/${fileId}/download`,
        {
          responseType: "blob"
        }
      )

      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement("a")

      link.href = url
      link.setAttribute("download", fileName)

      document.body.appendChild(link)
      link.click()

      toast.success("Download berhasil")

    } catch (err) {
      toast.error("Gagal download file")
      console.error(err)
    } finally {
      setLoadingId(null)
    }
  }

  return (

    <Card sx={{ borderRadius: 3 }}>

      <CardContent>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Attachments
        </Typography>

        {files.length === 0 && (
          <Typography fontSize={14} color="text.secondary">
            No attachments
          </Typography>
        )}

        {files.map(file => (

          <Box key={file.id} sx={{ mb: 1 }}>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => downloadFile(file.id, file.file_name)}
              disabled={loadingId === file.id}
            >
              {loadingId === file.id
                ? <CircularProgress size={20} />
                : file.file_name
              }
            </Button>

          </Box>

        ))}

      </CardContent>

    </Card>

  )
}