import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/login/authenticate`,
        { username, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = response.data;
      setMessage(data.message || "Login exitoso");

      let role = "";
      if (data.roles?.includes("ADMIN")) role = "ADMIN";
      else if (data.roles?.includes("ROLE_USER")) role = "USER";

      localStorage.setItem("userRole", role);
      localStorage.setItem("username", username);

      navigate("/index");
    } catch (error) {
      console.error(error);
      setMessage("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src="/inventario.jpeg" width={100} height={100} />
        <h1 className="login-title">Sistema de Inventario</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />

          <button type="submit" className="login-button">
            Entrar
          </button>
        </form>

        {message && <p className="login-message">{message}</p>}

        {/* ✅ ENLACE A REGISTER */}
        <p
          className="login-link"
          style={{ marginTop: "15px", cursor: "pointer", color: "#3498db" }}
          onClick={() => navigate("/registro")}
        >
          ¿No tienes cuenta? Crear usuario
        </p>
      </div>
    </div>
  );
}

export default Login;
