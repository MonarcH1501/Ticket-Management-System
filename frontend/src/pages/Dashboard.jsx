import { useState } from "react"
import { Tabs, Tab, Box } from "@mui/material"

import OverviewTab from "../Components/dashboard/OverviewTab"
import MyTasksTab from "../Components/dashboard/MyTasksTab"
import AnalyticsTab from "../Components/dashboard/AnalyticsTab"

export default function Dashboard(){

  const [tab,setTab] = useState(0)

  return(

    <Box>

      <Tabs
        value={tab}
        onChange={(e,v)=>setTab(v)}
        sx={{ mb:3 }}
      >
        <Tab label="Overview"/>
        <Tab label="My Tasks"/>
        <Tab label="Analytics"/>
      </Tabs>

      {tab === 0 && <OverviewTab/>}
      {tab === 1 && <MyTasksTab/>}
      {tab === 2 && <AnalyticsTab/>}

    </Box>

  )

}