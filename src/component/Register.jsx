import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/Login.css"; // Reutilizamos el mismo CSS

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/login/create`,
        { username, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setMessage("✅ Usuario creado correctamente");

      setTimeout(() => {
        navigate("/"); // Redirige al login
      }, 1500);
    } catch (error) {
      console.error(error);
      setMessage("❌ Error al crear usuario");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src="/inventario.jpeg" width={100} height={100} />
        <h1 className="login-title">Crear Cuenta</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Nuevo usuario"
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
            Registrar
          </button>
        </form>

        {message && <p className="login-message">{message}</p>}

        <p
          style={{ marginTop: "15px", cursor: "pointer", color: "#3498db" }}
          onClick={() => navigate("/")}
        >
          ¿Ya tienes cuenta? Inicia sesión
        </p>
      </div>
    </div>
  );
}

export default Register;
