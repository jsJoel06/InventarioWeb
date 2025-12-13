import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditarProducto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precioCosto: "",
    precio: "",
    cantidad: "",
  });

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/productos/${id}`)
      .then((response) => setProducto(response.data))
      .catch((error) => console.error("Error al obtener producto:", error));
  }, [id]);

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`${import.meta.env.VITE_API_URL}/productos/${id}`, producto)
      .then(() => navigate("/index"))
      .catch((error) => console.error("Error al actualizar producto:", error));
  };

  return (
    <div className="container-form">
      {/* Contenido del formulario */}
      <main className="form-content">
        <form onSubmit={handleSubmit}>
          <h1>Editar Producto</h1>

          <div>
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={producto.nombre}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="descripcion">Descripción</label>
            <input
              type="text"
              name="descripcion"
              value={producto.descripcion}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="precioCosto">Precio Costo</label>
            <input
              type="number"
              name="precioCosto"
              value={producto.precioCosto}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="precio">Precio </label>
            <input
              type="number"
              name="precio"
              value={producto.precio}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="cantidad">Cantidad</label>
            <input
              type="number"
              name="cantidad"
              value={producto.cantidad}
              onChange={handleChange}
            />
          </div>

          <button type="submit">Guardar Cambios</button>
        </form>
      </main>
    </div>
  );
}

export default EditarProducto;
