import { useState } from "react"
import { Outlet } from "react-router-dom"
import { Box } from "@mui/material"

import Sidebar from "./Sidebar"
import Header from "./Header"
import Footer from "./Footer"
import AppBreadcrumb from "../Components/AppBreadcrumb"

export default function Template(){

  const [collapsed,setCollapsed] = useState(false)

  const drawerWidth = collapsed ? 80 : 240

  return(

    <Box sx={{ display:"flex", minHeight:"100vh", background:"#f5f7fb" }}>

      {/* SIDEBAR */}
      <Sidebar collapsed={collapsed} drawerWidth={drawerWidth}/>

      {/* MAIN AREA */}
      <Box
        sx={{
          flex:1,
          display:"flex",
          flexDirection:"column",
          transition:"all .2s"
        }}
      >

        {/* HEADER */}
        <Header
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        {/* BREADCRUMB */}
        <Box sx={{ px:4, py:2 }}>
          <AppBreadcrumb/>
        </Box>

        {/* CONTENT */}
        <Box
          sx={{
            flex: 1,
            p: 3,
            width: "100%",
          }}
        >
          <Outlet />
        </Box>

        {/* FOOTER */}
        <Footer/>

      </Box>

    </Box>

  )

}