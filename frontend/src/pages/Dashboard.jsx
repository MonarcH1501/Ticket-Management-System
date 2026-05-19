import { useState, useContext } from "react"
import { Tabs, Tab, Box } from "@mui/material"
import { AuthContext } from "../context/auth-context"
import { PRIMARY, PRIMARY_BG } from "../theme/colors"

import OverviewTab  from "../Components/dashboard/OverviewTab"
import MyTasksTab   from "../Components/dashboard/MyTasksTab"
import AnalyticsTab from "../Components/dashboard/AnalyticsTab"

export default function Dashboard() {
  const [tab, setTab] = useState(0)
  const { user } = useContext(AuthContext)

  const canViewAnalytics = user?.roles?.some(r =>
    ["admin", "superadmin", "kepala_department"].includes(r.name)
  )

  return (
    <Box>
      <Tabs
        value={tab}
        onChange={(_, v) => {
          if (!canViewAnalytics && v === 2) return
          setTab(v)
        }}
        sx={{
          mb: 3,
          "& .MuiTabs-indicator": { backgroundColor: PRIMARY, height: 2.5, borderRadius: 99 },
          "& .MuiTab-root": { textTransform: "none", fontWeight: 700, fontSize: 13, color: "#94a3b8" },
          "& .Mui-selected": { color: `${PRIMARY} !important` }
        }}
      >
        <Tab label="Overview"  />
        <Tab label="My Tasks"  />
        {canViewAnalytics && <Tab label="Analytics" />}
      </Tabs>

      {tab === 0 && <OverviewTab />}
      {tab === 1 && <MyTasksTab />}
      {tab === 2 && canViewAnalytics && <AnalyticsTab />}
    </Box>
  )
}