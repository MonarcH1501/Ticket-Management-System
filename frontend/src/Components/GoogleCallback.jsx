import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
export default function GoogleCallback() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => { 
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const user = JSON.parse(urlParams.get("user"));

    if (token && user) {
      // Simpan token dan user ke context
      login(user, token);

      // Redirect ke dashboard
      navigate("/");
    } else {
      alert("Gagal login dengan Google");
      navigate("/login");
    }
  }, [navigate, login]);

  return <div>Loading...</div>;
}