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
  Button
} from "@mui/material"

export default function Login(){

  const [showForm,setShowForm] = useState(false)
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")

  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogin = async (e) => {

    e.preventDefault()

    try{

      const res = await api.post("/login",{ email,password })

      login(res.data.user,res.data.token)

      navigate("/")

    }catch(err){

      alert(err.response?.data?.message || "Login gagal")

    }

  }

  return(

    <Box
      sx={{
        height:"100vh",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        background:"linear-gradient(90deg,#b7c5d3,#d4dde6,#aab7c5)"
      }}
    >

      <Card sx={{ width:600, borderRadius:3 }}>

        <CardContent sx={{ textAlign:"center", p:5 }}>

          {/* LOGO */}
          <Box
            component="img"
            src={logo}
            sx={{
              width:70,
              cursor:"pointer",
              mb:2
            }}
            onClick={()=>setShowForm(!showForm)}
          />

          <Typography variant="h5" sx={{ fontWeight:600 }}>
            Ticket Management System
          </Typography>

          <Typography sx={{ color:"#6b7280", mt:1, mb:3 }}>
            Sign in to your account
          </Typography>

          {!showForm ? (

            <Button
              fullWidth
              variant="outlined"
              sx={{ py:1.4 }}
            >
              Login With Google
            </Button>

          ) : (

            <Box component="form" onSubmit={handleLogin}>

              <TextField
                fullWidth
                label="Email"
                margin="normal"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
              />

              <Button
                fullWidth
                variant="contained"
                sx={{ mt:2, py:1.3 }}
                type="submit"
              >
                Login
              </Button>

            </Box>

          )}

        </CardContent>

      </Card>

    </Box>

  )

}