import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


function Movimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [search, setSearch] = useState('');

  async function fetchMovimientos() {
    try {
      const response = await axios.get('http://localhost:8080/movimientos');
      setMovimientos(response.data);
    } catch (error) {
      console.error('Error al obtener movimientos', error);
    }
  }

  useEffect(() => {
    fetchMovimientos();
  }, []);

  // Filtrar por nombre del producto
  const filterMovimientos = movimientos.filter(mov =>
    mov.producto.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <div className="sidebar">
        <h2>Menú Inventario</h2>
        <a href="/">Regresar</a>
        <a href="/agregar-movimiento">Agregar Movimiento</a>
        <a href="/inventarios">Inventarios</a>
        <a href="/movimientos">Movimientos</a>
        <a href="/reportes">Reportes</a>
      </div>

      <div className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Movimientos</h1>
          <div className="search-container">
            <input
              type="text"
              value={search}
              placeholder="Buscar por nombre"
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Nombre Producto</th>
              <th>Descripción Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Tipo</th>
              <th>Fecha</th>
              <th>Descripción Mov.</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filterMovimientos.length === 0 ? (
              <tr>
                <td colSpan="8">No hay movimientos disponibles</td>
              </tr>
            ) : (
              filterMovimientos.map((movi) => (
                <tr key={movi.id}>
                  <td>{movi.producto.nombre}</td>
                  <td>{movi.producto.descripcion}</td>
                  <td>{movi.producto.precio}</td>
                  <td>{movi.cantidad}</td>
                  <td>{movi.tipo}</td>
                  <td>{movi.fecha ? new Date(movi.fecha).toLocaleString() : '-'}</td>
                  <td>{movi.descripcion}</td>
                
                    <td>
      <Link to={`/movimientos/editar/${movi.id}`}>
        <button className="edit">Editar</button>
      </Link>
                    <button className="delete">Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Movimientos;
