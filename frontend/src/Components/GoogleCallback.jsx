// GoogleCallback.jsx
import { useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import api from "../api/axios";
import { CircularProgress, Box, Typography } from "@mui/material";

export default function GoogleCallback() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => { 
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    const error = urlParams.get("error");

    const processLogin = async () => {
      // Handle error dari backend
      if (error === "not_registered") {
        alert("Email tidak terdaftar. Silakan login dengan email yang terdaftar.");
        navigate("/login");
        return;
      }
      
      if (error === "google_failed") {
        alert("Login dengan Google gagal. Silakan coba lagi.");
        navigate("/login");
        return;
      }

      // Proses token
      if (token) {
        try {
          // Fetch user data dari API menggunakan token
          const response = await api.get("/user", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          const user = response.data;
          
          // Simpan token dan user ke context
          login(user, token);
          
          // Redirect ke dashboard
          navigate("/");
        } catch (err) {
          console.error("Failed to fetch user:", err);
          alert("Gagal mengambil data user");
          navigate("/login");
        }
      } else if (!error) {
        // No token and no error - something wrong
        alert("Login gagal: Token tidak ditemukan");
        navigate("/login");
      }
    };

    processLogin();
  }, [location, login, navigate]);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column"
      }}
    >
      <CircularProgress size={60} />
      <Typography sx={{ mt: 2 }}>
        Memproses login Google...
      </Typography>
    </Box>
  );
}