import { useEffect, useState } from "react";
import api from "../../api/axios";

import Grid from "@mui/material/Grid";
import {
  Box,
  CircularProgress,
  Typography
} from "@mui/material";

import StatCard from "./StatCard";
import DashboardChart from "./DashboardChart";
import RecentTickets from "./RecentTickets";

import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";

export default function OverviewTab() {
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, trendsRes, recentRes] = await Promise.all([
          api.get("/tickets/summary"),
          api.get("/tickets/trends"),
          api.get("/tickets/recent")
        ]);

        setSummary(summaryRes.data);
        setTrends(trendsRes.data);
        setRecent(recentRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
  setTimeout(() => {
    window.dispatchEvent(new Event("resize"));
  }, 100);
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          gap: 2
        }}
      >
        <CircularProgress sx={{ color: "#6366f1" }} />
        <Typography color="text.secondary">
          Loading dashboard...
        </Typography>
      </Box>
    );
  }

  const total = summary?.overview?.total ?? 0;
  const progress = summary?.overview?.in_progress ?? 0;
  const completed = summary?.overview?.completed ?? 0;
  const approval = summary?.my_action?.need_my_approval ?? 0;

  return (
    <Box sx={{ minHeight: 0 }}>
      
      {/* STATS */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard
            title="Total Tickets"
            value={total}
            icon={<ConfirmationNumberIcon />}
            gradient="linear-gradient(135deg,#6366f1,#8b5cf6)"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard
            title="In Progress"
            value={progress}
            icon={<PendingActionsIcon />}
            gradient="linear-gradient(135deg,#06b6d4,#3b82f6)"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard
            title="Completed"
            value={completed}
            icon={<TaskAltIcon />}
            gradient="linear-gradient(135deg,#22c55e,#16a34a)"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard
            title="Need Approval"
            value={approval}
            icon={<HourglassTopIcon />}
            gradient="linear-gradient(135deg,#f59e0b,#ef4444)"
          />
        </Grid>

      </Grid>

      {/* CHART */}
      <Box
        sx={{
          mb: 4,
          p: 3,
          bgcolor: "background.paper",
          borderRadius: 3,
          height: 350,          // 🔥 FIX CHART ERROR
          minHeight: 0
        }}
      >
        <DashboardChart data={trends} />
      </Box>

      {/* RECENT */}
      <Box
        sx={{
          p: 3,
          bgcolor: "background.paper",
          borderRadius: 3
        }}
      >
        <RecentTickets tickets={recent} />
      </Box>

    </Box>
  );
}