import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EliminarM from './EliminarM';

function Movimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [search, setSearch] = useState('');

  const userRole = localStorage.getItem("userRole") || "";
  const isAdmin = userRole === "ADMIN";

  async function fetchMovimientos() {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/movimientos`);
      setMovimientos(response.data);
    } catch (error) {
      console.error('Error al obtener movimientos', error);
    }
  }

  useEffect(() => {
    fetchMovimientos();
  }, []);

  const filterMovimientos = movimientos.filter(mov =>
    mov.producto?.nombre?.toLowerCase().includes(search.toLowerCase())
  );

  // --- LÓGICA DE GANANCIA REAL (VENTA - COSTO) ---
  const totals = filterMovimientos.reduce(
    (acc, mov) => {
      const pCosto = mov.producto ? parseFloat(mov.producto.precioCosto) : 0;
      const pVenta = mov.producto ? parseFloat(mov.producto.precio) : 0;
      const cant = parseInt(mov.cantidad) || 0;
      const tipo = mov.tipo ? mov.tipo.toUpperCase() : '';

      if (tipo === 'SALIDA') {
        acc.totalIngresos += pVenta * cant;
        acc.totalInversionVendida += pCosto * cant;
      } else if (tipo === 'ENTRADA') {
        // Opcional: puedes trackear cuánto has gastado en reponer stock aquí
        acc.totalComprasStock += pCosto * cant;
      }

      return acc;
    },
    { totalIngresos: 0, totalInversionVendida: 0, totalComprasStock: 0 }
  );

  const gananciaNeta = totals.totalIngresos - totals.totalInversionVendida;

  return (
    <div className="container">
      <div className="sidebar">
        <h2>Menú Inventario</h2>
        <Link to="/index">Regresar</Link>
        {isAdmin && <Link to="/agregar-movimiento">Agregar Movimiento</Link>}
        <Link to="/inventarios">Inventarios</Link>
        <Link to="/movimientos">Movimientos</Link>
        <Link to="/reportes">Reportes</Link>
        <Link to="/">Salir</Link>
      </div>

      <div className="main-content">
        <h2>📊 Resumen de Ganancias Reales</h2>
        
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
          <div className="card" style={{ padding: '15px', background: '#fff', borderLeft: '5px solid #d9534f', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', flex: 1 }}>
            <span style={{ color: '#777', fontSize: '0.8rem' }}>COSTO DE LO VENDIDO</span>
            <h3 style={{ margin: '5px 0', color: '#d9534f' }}>${totals.totalInversionVendida.toFixed(2)}</h3>
          </div>

          <div className="card" style={{ padding: '15px', background: '#fff', borderLeft: '5px solid #5cb85c', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', flex: 1 }}>
            <span style={{ color: '#777', fontSize: '0.8rem' }}>VENTA TOTAL</span>
            <h3 style={{ margin: '5px 0', color: '#5cb85c' }}>${totals.totalIngresos.toFixed(2)}</h3>
          </div>

          <div className="card" style={{ padding: '15px', background: '#fff', borderLeft: '5px solid #337ab7', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', flex: 1 }}>
            <span style={{ color: '#777', fontSize: '0.8rem' }}>GANANCIA LIMPIA</span>
            <h3 style={{ margin: '5px 0', color: gananciaNeta >= 0 ? '#337ab7' : '#d9534f' }}>
              ${gananciaNeta.toFixed(2)}
            </h3>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
          <h1>Historial de Movimientos</h1>
          <input
            type="text"
            placeholder="🔍 Buscar producto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '10px', width: '300px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
        </div>

        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Costo Compra</th>
              <th>Precio Venta</th>
              <th>Cant.</th>
              <th>Tipo</th>
              <th>Ganancia Mov.</th>
              {isAdmin && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {filterMovimientos.map((movi) => {
              const pCosto = parseFloat(movi.producto?.precioCosto) || 0;
              const pVenta = parseFloat(movi.producto?.precio) || 0;
              
              // Si es salida, la ganancia es (Venta - Costo) * Cantidad
              // Si es entrada, la ganancia es 0 (porque es una compra tuya)
              const gananciaFila = movi.tipo === 'SALIDA' 
                ? (pVenta - pCosto) * movi.cantidad 
                : 0;

              return (
                <tr key={movi.id}>
                  <td><strong>{movi.producto?.nombre}</strong></td>
                  <td>${pCosto.toFixed(2)}</td>
                  <td>${pVenta.toFixed(2)}</td>
                  <td>{movi.cantidad}</td>
                  <td>
                    <span style={{ 
                      padding: '3px 8px', borderRadius: '10px', fontSize: '0.75rem',
                      background: movi.tipo === 'ENTRADA' ? '#e1f5fe' : '#fff3e0',
                      color: movi.tipo === 'ENTRADA' ? '#0288d1' : '#ef6c00'
                    }}>
                      {movi.tipo}
                    </span>
                  </td>
                  <td style={{ fontWeight: 'bold', color: gananciaFila > 0 ? '#337ab7' : '#777' }}>
                    {movi.tipo === 'SALIDA' ? `$${gananciaFila.toFixed(2)}` : '---'}
                  </td>
                  {isAdmin && (
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link to={`/movimientos/editar/${movi.id}`}>
                        <button className="edit">Editar</button>
                        </Link>
                        <EliminarM
                          id={movi.id}
                          onDelete={(id) => setMovimientos(movimientos.filter(m => m.id !== id))}
                        />
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Movimientos;