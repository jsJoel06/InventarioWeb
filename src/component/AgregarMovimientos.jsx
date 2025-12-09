import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AgregarMovimiento() {
  const [productos, setProductos] = useState([]);
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [tipo, setTipo] = useState("ENTRADA");
  const [descripcion, setDescripcion] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Traer productos para seleccionar en el movimiento
    const fetchProductos = async () => {
      try {
        const res = await axios.get("http://localhost:8080/productos");
        setProductos(res.data);
      } catch (err) {
        console.error("Error al obtener productos", err);
      }
    };

    fetchProductos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productoId || !cantidad) {
      return alert("Selecciona un producto y cantidad válida");
    }

    const movimiento = {
      producto: { id: parseInt(productoId) },
      cantidad: parseInt(cantidad),
      tipo: tipo,
      descripcion: descripcion,
      fecha: new Date(),
    };

    try {
      await axios.post("https://inventarios-n618.onrender.com/movimientos", movimiento);
      alert("Movimiento agregado con éxito");
      setProductoId("");
      setCantidad("");
      setDescripcion("");
      navigate("/movimientos");
    } catch (err) {
      console.error("Error al agregar movimiento", err);
      alert("Error al agregar movimiento");
    }
  };

  return (
    <div className="container-form">
      <div className="form-content">
        <form onSubmit={handleSubmit}>
          <h1>Agregar Movimiento</h1>

          <div>
            <label>Producto:</label>
            <select
              value={productoId}
              onChange={(e) => setProductoId(e.target.value)}
              required
            >
              <option value="">--Selecciona un producto--</option>
              {productos.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.nombre} (Stock: {prod.cantidad})
                </option>
              ))}
            </select>
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

          <div>
            <label>Tipo:</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="ENTRADA">ENTRADA</option>
              <option value="SALIDA">SALIDA</option>
            </select>
          </div>

          <div>
            <label>Descripción:</label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          <button type="submit">Agregar Movimiento</button>
        </form>
      </div>
    </div>
  );
}

export default AgregarMovimiento;
