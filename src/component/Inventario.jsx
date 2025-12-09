import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Eliminar from "./Eliminar";

function Inventario() {
  const [productos, setProductos] = useState([]);
  const [search, setSearch] = useState("");

  const userRole = localStorage.getItem("userRole") || "";
  const isAdmin = userRole === "ADMIN";

  async function fetchProductos() {
    try {
      const response = await axios.get("https://inventarios-n618.onrender.com/productos");
      setProductos(response.data);
    } catch (error) {
      console.error("Error al obtener productos", error);
    }
  }

  useEffect(() => {
    fetchProductos();
  }, []);

  const filterProductos = productos.filter((pro) =>
    pro.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <div className="sidebar">
        <h2>Menú Inventario</h2>
        <a href="/index">Regresar</a>
        <a href="/inventarios">Inventarios</a>
        <a href="/movimientos">Movimientos</a>
        <a href="/reportes">Reportes</a>
      </div>
      o
      <div className="main-content">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>Inventarios</h1>
          <div className="search-container">
            <input
              type="text"
              value={search}
              placeholder="Buscar por nombre"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Cantidad</th>
              {isAdmin && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {filterProductos.length === 0 ? (
              <tr>
                <td colSpan="5">No hay productos disponibles</td>
              </tr>
            ) : (
              filterProductos.map((prod) => (
                <tr key={prod.id}>
                  <td>{prod.nombre}</td>
                  <td>{prod.descripcion}</td>
                  <td>{prod.precio}</td>
                  <td>{prod.cantidad}</td>

                  {isAdmin && (
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <Link to={`/inventarios/edita/${prod.id}`}>
                          <button className="edit">Editar</button>
                        </Link>
                        <Eliminar
                          id={prod.id}
                          onDelete={(idEliminado) =>
                            setProductos(
                              productos.filter((p) => p.id !== idEliminado)
                            )
                          }
                        />
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Inventario;
