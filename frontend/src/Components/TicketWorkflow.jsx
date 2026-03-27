import { useEffect, useState } from "react"
import api from "../api/axios"

import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack
} from "@mui/material"

export default function TicketWorkflow({ ticketId }) {

  const [steps, setSteps] = useState([])

  useEffect(() => {

    api.get(`/tickets/${ticketId}/workflow`)
      .then(res => {

        console.log("WORKFLOW:", res.data)

        const data = res.data

        // ✅ ambil steps dari backend baru
        setSteps(data.steps ?? [])

      })
      .catch(err => {
        console.error("Workflow error:", err)
        setSteps([])
      })

  }, [ticketId])

  const getColor = (status) => {
    if (status === "done") return "#22c55e"
    if (status === "current") return "#3b82f6"
    return "#cbd5f5"
  }

  return (

    <Card sx={{ borderRadius: 3, boxShadow: 2 }}>

      <CardContent>

        <Typography fontWeight="bold" sx={{ mb: 3 }}>
          🔄 Workflow Timeline
        </Typography>

        {steps.length === 0 && (
          <Typography fontSize={14} color="text.secondary">
            No workflow yet
          </Typography>
        )}

        <Stack spacing={3}>

          {steps.map((step, index) => (

            <Box key={index} sx={{ display: "flex" }}>

              {/* LEFT DOT + LINE */}
              <Box sx={{ mr: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: getColor(step.status)
                  }}
                />

                {index !== steps.length - 1 && (
                  <Box
                    sx={{
                      width: 2,
                      flex: 1,
                      background: "#e5e7eb",
                      mt: 0.5
                    }}
                  />
                )}
              </Box>

              {/* CONTENT */}
              <Box>

                <Typography fontWeight={500}>
                  {step.label}
                </Typography>

                <Typography fontSize={13} color="text.secondary">
                  Status: {step.status}
                </Typography>

                {step.actor && (
                  <Typography fontSize={13}>
                    👤 {step.actor}
                  </Typography>
                )}

                {step.completed_at && (
                  <Typography fontSize={12} color="text.secondary">
                    {new Date(step.completed_at).toLocaleString()}
                  </Typography>
                )}

              </Box>

            </Box>

          ))}

        </Stack>

      </CardContent>

    </Card>

  )

}