import { useEffect, useState } from "react";
import "./HistorialFacturas.css";

function HistorialFacturas({ clienteCorreo }) {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clienteId, setClienteId] = useState(null);

  // Filtros
  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroTotalMin, setFiltroTotalMin] = useState("");
  const [filtroTotalMax, setFiltroTotalMax] = useState("");

  // ---------------------------
  // Obtener clienteId por correo
  // ---------------------------
  useEffect(() => {
    if (!clienteCorreo) {
      console.warn("No se proporcionó correo de cliente");
      setLoading(false);
      return;
    }

    const fetchClienteId = async () => {
      try {
        const res = await fetch(`http://localhost:8080/clientes?correo=${clienteCorreo}`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setClienteId(data[0].id);
        } else {
          console.warn("Cliente no encontrado para el correo:", clienteCorreo);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error al obtener cliente:", err);
        setLoading(false);
      }
    };

    fetchClienteId();
  }, [clienteCorreo]);

  // ---------------------------
  // Obtener facturas por clienteId
  // ---------------------------
  const fetchFacturas = async (id = clienteId) => {
    if (!id) return;

    setLoading(true);
    try {
      let url = `http://localhost:8080/facturas/cliente/${id}`;
      const params = new URLSearchParams();
      if (filtroCliente) params.append("cliente", filtroCliente);
      if (filtroFecha) params.append("fecha", filtroFecha);
      if (filtroTotalMin) params.append("totalMin", filtroTotalMin);
      if (filtroTotalMax) params.append("totalMax", filtroTotalMax);
      if ([...params].length) url += `?${params.toString()}`;

      const res = await fetch(url);
      const data = await res.json();
      setFacturas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al obtener facturas:", err);
      setFacturas([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // Refrescar facturas cuando clienteId o filtros cambien
  // ---------------------------
  useEffect(() => {
    if (clienteId) {
      fetchFacturas();
    }
  }, [clienteId, filtroCliente, filtroFecha, filtroTotalMin, filtroTotalMax]);

  // ---------------------------
  // Render
  // ---------------------------
  if (loading) return <p>Cargando historial...</p>;
  if (!facturas || facturas.length === 0) return <p>No hay facturas.</p>;

  return (
    <div className="historial-container">
      <h2>Historial de Facturas</h2>

      {/* Filtros */}
      <div className="filtros">
        <input
          type="text"
          placeholder="Buscar por cliente"
          value={filtroCliente}
          onChange={(e) => setFiltroCliente(e.target.value)}
        />
        <input
          type="date"
          value={filtroFecha}
          onChange={(e) => setFiltroFecha(e.target.value)}
        />
        <input
          type="number"
          placeholder="Total mínimo"
          value={filtroTotalMin}
          onChange={(e) => setFiltroTotalMin(e.target.value)}
        />
        <input
          type="number"
          placeholder="Total máximo"
          value={filtroTotalMax}
          onChange={(e) => setFiltroTotalMax(e.target.value)}
        />
        <button onClick={() => fetchFacturas()}>Aplicar filtros</button>
      </div>

      {/* Tabla */}
      <table className="historial-table">
        <thead>
          <tr>
            <th>Factura</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {facturas.map((f) => (
            <tr key={f.id}>
              <td>{f.id}</td>
              <td>{f.fecha ? f.fecha.substring(0, 10) : "N/A"}</td>
              <td>${f.total?.toFixed(2) || "0.00"}</td>
              <td>
                <span
                  className={`badge ${
                    f.estado === "PENDIENTE"
                      ? "badge-yellow"
                      : f.estado === "PAGADA"
                      ? "badge-green"
                      : "badge-red"
                  }`}
                >
                  {f.estado}
                </span>
              </td>
              <td>
                <a
                  href={`http://localhost:5173/facturas/${f.id}`}
                  className="btn-ver"
                >
                  Ver
                </a>
                <a
                  href={`http://localhost:8080/facturas/${f.id}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pdf"
                >
                  PDF
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HistorialFacturas;
