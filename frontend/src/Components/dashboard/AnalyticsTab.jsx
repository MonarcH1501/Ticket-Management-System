import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Box, Typography, CircularProgress } from "@mui/material";

import DepartmentChart from "./DepartmentChart";
import StatusChart from "./StatusChart";
import MetricsCards from "./MetricsCards";
import TrendChart from "./TrendChart";

export default function AnalyticsTab() {
  const [department, setDepartment] = useState([]);
  const [status, setStatus] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      api.get("/tickets/by-department"),
      api.get("/tickets/by-status"),
      api.get("/tickets/metrics"),
      api.get("/tickets/trends")
    ])
      .then(([deptRes, statusRes, metricsRes, trendsRes]) => {
        if (isMounted) {
          setDepartment(deptRes.data || []);
          setStatus(statusRes.data || []);
          setMetrics(metricsRes.data || null);
          setTrends(trendsRes.data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error(err);
          setError("Failed to load analytics data");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 500 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 500 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      
      {/* TITLE */}
      <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
        Analytics Dashboard
      </Typography>

      {/* 🟢 METRICS (3 COLUMN GRID) */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(3, 1fr)"
          },
          gap: 3,
          mb: 3
        }}
      >
        <MetricsCards data={metrics} />
      </Box>

      {/* 🟡 CHART ROW (2 COLUMN) */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr"
          },
          gap: 3,
          mb: 3
        }}
      >
        <DepartmentChart data={department} />
        <StatusChart data={status} />
      </Box>

      {/* 🔵 TREND FULL WIDTH */}
      <Box>
        <TrendChart data={trends} />
      </Box>

    </Box>
  );
}