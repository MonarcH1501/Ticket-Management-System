import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import { AuthContext } from "../context/auth-context"
import logo from "../assets/imma.png"
import { CircularProgress } from "@mui/material"

const inputStyle = {
  width: "100%", padding: "11px 14px", fontSize: 14,
  borderRadius: 9, border: "1.5px solid #e2e8f0",
  background: "#fafafa", color: "#0f172a", outline: "none",
  boxSizing: "border-box", fontFamily: "inherit", transition: "border-color .15s"
}

export default function Login() {
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading]   = useState(false)
  const [showPw, setShowPw]     = useState(false)
  const [showForm, setShowForm] = useState(false)

  const { login }  = useContext(AuthContext)
  const navigate   = useNavigate()

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

  const handleGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/login/google`
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0fdf4 100%)",
      fontFamily: "'DM Sans', sans-serif", padding: 24
    }}>
      {/* Decorative blobs */}
      <div style={{ position: "fixed", top: -100, left: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,.12), transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,.1), transparent 70%)", pointerEvents: "none" }} />

      <div style={{
        width: "100%", maxWidth: 400,
        background: "#fff", borderRadius: 20,
        border: "1px solid #e2e8f0",
        boxShadow: "0 8px 40px rgba(0,0,0,.08)",
        padding: "40px 36px", position: "relative", zIndex: 1
      }}>

        {/* Logo + Title */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            onClick={() => setShowForm(p => !p)}
            style={{
              display: "inline-block",
              cursor: "pointer",
              borderRadius: 14,
              transition: "transform .2s, box-shadow .2s",
              transform: showForm ? "scale(0.93)" : "scale(1)",
              boxShadow: showForm
                ? "0 2px 8px rgba(99,102,241,.2)"
                : "0 4px 14px rgba(99,102,241,.2)",
              marginBottom: 14
            }}
            title={showForm ? "Sembunyikan form" : "Login dengan email"}
          >
            <img
              src={logo}
              alt="logo"
              style={{
                width: 64, height: 64, objectFit: "contain",
                borderRadius: 14, display: "block"
              }}
            />
          </div>

          <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>
            Ticket Management System
          </div>

          <div style={{
            fontSize: 13, color: "#94a3b8", marginTop: 6,
            opacity: showForm ? 0 : 1,
            transition: "opacity .3s"
          }}>
            Tap logo untuk login dengan email
          </div>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogle}
          style={{
            width: "100%", padding: "11px 0", borderRadius: 9,
            border: "1.5px solid #e2e8f0", background: "#fff",
            color: "#0f172a", fontWeight: 600, fontSize: 14,
            cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            transition: "background .15s, border-color .15s"
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#c7d2fe" }}
          onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e2e8f0" }}
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.7 2.4 30.2 0 24 0 14.7 0 6.8 5.4 3 13.3l7.8 6C12.7 13.2 17.9 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.1-10 7.1-17z"/>
            <path fill="#FBBC05" d="M10.8 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7L2.5 13.2A24 24 0 0 0 0 24c0 3.9.9 7.5 2.5 10.8l8.3-6.1z"/>
            <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.1 0-11.3-3.7-13.2-9l-7.8 6C6.8 42.6 14.7 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        {/* Form — muncul saat logo diklik */}
        <div style={{
          overflow: "hidden",
          maxHeight: showForm ? 400 : 0,
          opacity: showForm ? 1 : 0,
          transition: "max-height .45s ease, opacity .35s ease"
        }}>
          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
            <div style={{ flex: 1, height: 1, background: "#f1f5f9" }} />
            <span style={{ fontSize: 12, color: "#cbd5e1", fontWeight: 600 }}>atau</span>
            <div style={{ flex: 1, height: 1, background: "#f1f5f9" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 6 }}>Email</div>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                tabIndex={showForm ? 0 : -1}
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = "#6366f1")}
                onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
              />
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 6 }}>Password</div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  tabIndex={showForm ? 0 : -1}
                  style={{ ...inputStyle, paddingRight: 42 }}
                  onFocus={e => (e.target.style.borderColor = "#6366f1")}
                  onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
                />
                <span
                  onClick={() => setShowPw(p => !p)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", cursor: "pointer", fontSize: 16, color: "#94a3b8", userSelect: "none" }}
                >
                  {showPw ? "🙈" : "👁️"}
                </span>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              tabIndex={showForm ? 0 : -1}
              style={{
                marginTop: 4, padding: "12px 0", borderRadius: 9, border: "none",
                background: loading ? "#e2e8f0" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
                color: loading ? "#94a3b8" : "#fff", fontWeight: 700, fontSize: 14,
                cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
                boxShadow: loading ? "none" : "0 4px 14px rgba(99,102,241,.35)",
                transition: "opacity .15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8
              }}
            >
              {loading ? <><CircularProgress size={18} sx={{ color: "#94a3b8" }} /> Signing in...</> : "Sign In →"}
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}