import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import AppBreadcrumb from "../Components/AppBreadcrumb";

export default function Template() {

  const [collapsed, setCollapsed] = useState(false);
  const drawerWidth = collapsed ? 80 : 240;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>

      <Sidebar collapsed={collapsed} drawerWidth={drawerWidth} />

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>

        <Header collapsed={collapsed} setCollapsed={setCollapsed} />

        <Box sx={{ px: 4, py: 2 }}>
          <AppBreadcrumb />
        </Box>

        <Box sx={{ flex: 1, px: 4, pb: 4, width: "100%" }}>
          <Outlet />
        </Box>

        <Footer />

      </Box>

    </Box>
  );
}