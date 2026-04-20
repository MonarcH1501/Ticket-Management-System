import { useState, useContext } from "react";
import { Tabs, Tab, Box } from "@mui/material";

import { AuthContext } from "../context/auth-context";

import OverviewTab from "../Components/dashboard/OverviewTab";
import MyTasksTab from "../Components/dashboard/MyTasksTab";
import AnalyticsTab from "../Components/dashboard/AnalyticsTab";

export default function Dashboard() {
  const [tab, setTab] = useState(0);
  const { user } = useContext(AuthContext);

  const canViewAnalytics = user?.roles?.some(
    r => ["admin", "superadmin", "kepala_department"].includes(r.name)
  );

  return (
    <Box>
      <Tabs
        value={tab}
        onChange={(e, newValue) => {
          if (!canViewAnalytics && newValue === 2) return;
          setTab(newValue);
        }}
        sx={{ mb: 3 }}
      >
        <Tab label="Overview" />
        <Tab label="My Tasks" />
        {canViewAnalytics && <Tab label="Analytics" />}
      </Tabs>

      {tab === 0 && <OverviewTab />}
      {tab === 1 && <MyTasksTab />}
      {tab === 2 && canViewAnalytics && <AnalyticsTab />}
    </Box>
  );
}