import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import { AuthContext } from "../context/auth-context"
import logo from "../assets/imma.png"

import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Divider
} from "@mui/material"

export default function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  // 🔹 LOGIN MANUAL
  const handleLogin = async (e) => {
    e.preventDefault()

    if (loading) return

    setLoading(true)

    try {
      const res = await api.post("/login", { email, password })

      login(res.data.user, res.data.token)
      navigate("/")

    } catch (err) {
      alert(err.response?.data?.message || "Login gagal")
    } finally {
      setLoading(false)
    }
  }

  // 🔹 LOGIN GOOGLE
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/login/google`
  }

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(90deg,#b7c5d3,#d4dde6,#aab7c5)"
      }}
    >

      <Card sx={{ width: 420, borderRadius: 3 }}>
        <CardContent sx={{ textAlign: "center", p: 5 }}>

          {/* LOGO */}
          <Box
            component="img"
            src={logo}
            sx={{
              width: 70,
              mb: 2
            }}
          />

          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Ticket Management System
          </Typography>

          <Typography sx={{ color: "#6b7280", mt: 1, mb: 3 }}>
            Sign in to your account
          </Typography>

          {/* 🔥 GOOGLE LOGIN */}
          <Button
            fullWidth
            variant="outlined"
            sx={{ py: 1.3, mb: 2 }}
            onClick={handleGoogleLogin}
          >
            Login with Google
          </Button>

          <Divider sx={{ my: 2 }}>or</Divider>

          {/* 🔹 FORM LOGIN */}
          <Box component="form" onSubmit={handleLogin}>

            <TextField
              fullWidth
              label="Email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                py: 1.3,
                position: "relative",
                transform: loading ? "scale(0.98)" : "scale(1)"
              }}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>

          </Box>

        </CardContent>
      </Card>

    </Box>
  )
}