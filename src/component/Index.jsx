import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Eliminar from "./Eliminar";

function Index() {
  const [productos, setProductos] = useState([]);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const userRole = localStorage.getItem("userRole") || "";
  const isAdmin = userRole === "ADMIN";

  // 🟧 Gasto fijo por viajes
  const GASTO_VIAJE = 60;

  async function fetchProductos() {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/productos`);
      setProductos(response.data);
    } catch (error) {
      console.error("Error al obtener productos", error);
    }
  }

  useEffect(() => {
    fetchProductos();
  }, []);

  // Filtrar productos
  const filterProductos = productos.filter((pro) =>
    pro.nombre.toLowerCase().includes(search.toLowerCase())
  );

  // Calcular totales generales
  const totals = filterProductos.reduce(
    (acc, prod) => {
      const costo = parseFloat(prod.precioCosto) || 0;
      const venta = parseFloat(prod.precio) || 0;
      const cantidad = parseInt(prod.cantidad) || 0;

      const totalCosto = costo * cantidad;
      const totalVenta = venta * cantidad;

      acc.totalCostoGeneral += totalCosto;
      acc.totalVentaGeneral += totalVenta;
      acc.totalGananciaGeneral += totalVenta - totalCosto;

      return acc;
    },
    { totalCostoGeneral: 0, totalVentaGeneral: 0, totalGananciaGeneral: 0 }
  );

  return (
    <>
      {/* Botón hamburguesa */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="container">
        <div className={`sidebar ${menuOpen ? "open" : ""}`}>
          <h2>Menú Inventario</h2>
          {isAdmin && <Link to="/agregar-producto">Agregar Producto</Link>}
          <Link to="/inventarios">Inventarios</Link>
          <Link to="/movimientos">Movimientos</Link>
          <Link to="/reportes">Reportes</Link>
          <Link to="/facturas">Facturas</Link>
          <a href="/" onClick={() => alert("¿Está seguro de cerrar sesión?")}>
            Salir
          </a>
        </div>

        <div className="main-content" onClick={() => setMenuOpen(false)}>

          {/* 🟧 RESUMEN GENERAL */}
          <div
            className="summary-box"
            style={{
              background: "#f1f1f1",
              padding: "15px",
              marginBottom: "20px",
              borderRadius: "8px",
            }}
          >
            <h2>📊 Resumen General</h2>
            <p><strong>Total Costo:</strong> ${totals.totalCostoGeneral.toFixed(2)}</p>
            <p><strong>Total Venta:</strong> ${totals.totalVentaGeneral.toFixed(2)}</p>

            {/* Gasto por viajes */}
            <p><strong>Gasto por Viajes:</strong> ${GASTO_VIAJE.toFixed(2)}</p>

            <p>
              <strong>Ganancia Total:</strong>{" "}
              ${(totals.totalGananciaGeneral - GASTO_VIAJE).toFixed(2)}
            </p>
          </div>

          {/* Título + buscador */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
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

          {/* Tabla */}
          <div style={{ overflowX: "auto", marginTop: "10px" }}>
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Precio Costo</th>
                  <th>Precio Venta</th>
                  <th>Cantidad</th>
                  <th>Total Costo</th>
                  <th>Total Venta</th>
                  <th>Ganancia Unidad</th>
                  <th>Ganancia Total</th>
                  {isAdmin && <th>Acciones</th>}
                </tr>
              </thead>

              <tbody>
                {filterProductos.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 9 : 8}>
                      No hay productos disponibles
                    </td>
                  </tr>
                ) : (
                  filterProductos.map((prod) => {
                    const costo = parseFloat(prod.precioCosto) || 0;
                    const venta = parseFloat(prod.precio) || 0;
                    const cantidad = parseInt(prod.cantidad) || 0;

                    const totalCosto = costo * cantidad;
                    const totalVenta = venta * cantidad;
                    const gananciaUnidad = venta - costo;
                    const gananciaTotal = gananciaUnidad * cantidad;

                    return (
                      <tr key={prod.id}>
                        <td>{prod.nombre}</td>
                        <td>{prod.descripcion}</td>
                        <td>{costo.toFixed(2)}</td>
                        <td>{venta.toFixed(2)}</td>
                        <td>{cantidad}</td>
                        <td>{totalCosto.toFixed(2)}</td>
                        <td>{totalVenta.toFixed(2)}</td>
                        <td>{gananciaUnidad.toFixed(2)}</td>
                        <td>{gananciaTotal.toFixed(2)}</td>

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
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Index;
