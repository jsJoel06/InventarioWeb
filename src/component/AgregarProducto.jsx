import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AgregarProducto() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [cantidad, setCantidad] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const producto = {
      nombre,
      descripcion,
      precio,
      cantidad,
    };

    try {
     await axios.post(`${import.meta.env.VITE_API_URL}/productos`, producto);
      alert("Producto agregado con éxito");
      navigate("/inventarios"); // redirige a la lista de productos
    } catch (error) {
      console.error("Error al agregar producto", error);
      alert("Error al agregar producto");
    }
  };

  return (
    <div className="container-form">
      <div className="form-content">
        <form onSubmit={handleSubmit}>
          <h1>Agregar Producto</h1>
          <div>
            <label>Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Descripción:</label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>
          <div>
            <label>Precio:</label>
            <input
              type="text"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Cantidad:</label>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              required
            />
          </div>
          <button type="submit">Agregar</button>
        </form>
      </div>
    </div>
  );
}

export default AgregarProducto;
