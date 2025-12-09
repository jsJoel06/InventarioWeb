import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Eliminar from "./Eliminar";

function Index() {
  const [productos, setProductos] = useState([]);
  const [search, setSearch] = useState("");

  // Leer rol desde localStorage
  const userRole = localStorage.getItem("userRole") || "";
  const isAdmin = userRole === "ADMIN";

 async function fetchProductos() {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/productos`);
    setProductos(response.data);
  } catch (error) {
    console.error("Error al obtener productos", error);

    if (error.response) {
      console.error("Respuesta del backend:", error.response.data);
    } else if (error.request) {
      console.error("No se recibió respuesta del backend");
    } else {
      console.error("Error inesperado:", error.message);
    }
  }
}


  useEffect(() => {
    fetchProductos();
  }, []);

  const filterProductos = productos.filter((pro) =>
    pro.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const hamdleClick = () => {
    alert("¿ Esta seguro de cerrar sesion?");
  };

  return (
    <div className="container">
      <div className="sidebar">
        <h2>Menú Inventario</h2>
        {isAdmin && <Link to="/agregar-producto">Agregar Producto</Link>}
        <Link to="/inventarios">Inventarios</Link>
        <Link to="/movimientos">Movimientos</Link>
        <Link to="/reportes">Reportes</Link>
        <Link to="/facturas">Facturas</Link> {/* Enlace agregado */}
        <a href="/" onClick={hamdleClick}>
          Salir
        </a>
      </div>

      <div className="main-content">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>Lista de Productos</h1>
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
                <td colSpan={isAdmin ? 5 : 4}>No hay productos disponibles</td>
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

export default Index;
