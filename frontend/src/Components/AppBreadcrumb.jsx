import Breadcrumbs from "@mui/material/Breadcrumbs"
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"
import { useLocation } from "react-router-dom"

export default function AppBreadcrumb() {

  const location = useLocation()

  const paths = location.pathname.split("/").filter(Boolean)

  return (
    <Breadcrumbs sx={{ mb: 0.5 }}>

      <Link underline="hover" color="inherit" href="/">
        Dashboard
      </Link>

      {paths.map((p, i) => (

        <Typography key={i} color="text.primary">
          {p}
        </Typography>

      ))}

    </Breadcrumbs>
  )
}