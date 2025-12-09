import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./FacturaList.css";

function FacturaList() {
  const [facturas, setFacturas] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/facturas")
      .then((res) => res.json())
      .then((data) => setFacturas(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error al obtener facturas:", err));
  }, []);

  return (
    <div className="factura-container">
      <h2 className="factura-title">🧾 Listado de Facturas</h2>

      <div className="factura-actions">
        <Link to="/facturas/crear" className="btn-nueva-factura">
          + Nueva Factura
        </Link>

        {/* Botón de historial */}
        <Link to="/facturas/historial" className="btn-historial-facturas">
          📜 Historial de Facturas
        </Link>
      </div>

      <div className="facturas-grid">
        {facturas.length === 0 ? (
          <p className="sin-facturas">No hay facturas disponibles</p>
        ) : (
          facturas.map((f) => (
            <div key={f.id} className="factura-card">
              <div className="factura-card-body">
                <h5 className="factura-card-title">Factura #{f.id}</h5>

                <p className="factura-card-text">
                  Cliente: <strong>{f.cliente?.nombre}</strong>
                </p>

                <p className="factura-card-text">
                  Fecha: {f.fecha?.substring(0, 10)}
                </p>

                <p className="factura-card-text">
                  Total: <strong>${f.total}</strong>
                </p>

                <div className="factura-card-buttons">
                  <Link to={`/facturas/${f.id}`} className="btn-ver">
                    Ver
                  </Link>

                  <a
                    href={`http://localhost:8080/facturas/${f.id}/pdf`}
                    className="btn-pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    PDF
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FacturaList;
