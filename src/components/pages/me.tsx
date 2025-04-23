import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Me = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("⚠️ Tu sesión ha expirado. Redirigiendo al login...");
      navigate("/login");
      return;
    }

    fetch("http://localhost:8000/usuarios/me", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      if (res.status === 401) {
        alert("⚠️ Tu sesión ha expirado. Redirigiendo al login...");
        localStorage.removeItem("access_token");
        navigate("/login");
      }
    }).catch(() => {
      alert("⚠️ Error al verificar sesión. Redirigiendo al login...");
      localStorage.removeItem("access_token");
      navigate("/login");
    });
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">👤 Información del usuario</h1>
    </div>
  );
};

export default Me;