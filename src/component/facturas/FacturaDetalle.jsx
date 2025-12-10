import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./FacturaDetalle.css";

function FacturaDetalle() {
  const { id } = useParams();
  const [factura, setFactura] = useState(null);
  const [loading, setLoading] = useState(true);
  const [montoPago, setMontoPago] = useState(0);
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [fechaPago, setFechaPago] = useState("");

 // Obtener factura
useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/facturas/${id}`)
    .then((res) => res.json())
    .then((data) => {
      setFactura(data);
      setLoading(false);

      // Inicializar monto pendiente, método y fecha
      const totalPagado =
        data.pagos?.reduce((sum, p) => sum + parseFloat(p.monto), 0) || 0;
      setMontoPago(data.total - totalPagado);
      setMetodoPago("Efectivo");
      setFechaPago(new Date().toISOString().substring(0, 10));
    })
    .catch((err) => {
      console.error("Error al obtener la factura:", err);
      setLoading(false);
    });
}, [id]);


  if (loading) return <p>Cargando...</p>;
  if (!factura) return <p>No se encontró la factura.</p>;

  // Badge de estado
  const estadoBadge = (estado) => {
    switch (estado) {
      case "PAGADA":
        return "badge badge-green";
      case "ANULADA":
        return "badge badge-red";
      case "PENDIENTE":
        return "badge badge-yellow";
      default:
        return "badge badge-gray";
    }
  };

  // Agregar pago
const agregarPago = () => {
  if (!montoPago || !metodoPago || !fechaPago) {
    alert("Completa todos los campos del pago");
    return;
  }

  fetch(`${import.meta.env.VITE_API_URL}/facturas/${id}/pagos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      monto: parseFloat(montoPago),
      metodo: metodoPago,
      fechaPago: fechaPago,
    }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Error al agregar el pago");
      return res.json();
    })
    .then((data) => {
      setFactura(data);

      // Actualizar monto pendiente automáticamente
      const totalPagado =
        data.pagos?.reduce((sum, p) => sum + parseFloat(p.monto), 0) || 0;
      const pendiente = data.total - totalPagado;
      setMontoPago(pendiente > 0 ? pendiente : 0);

      setMetodoPago("Efectivo");
      setFechaPago(new Date().toISOString().substring(0, 10));

      alert("Pago agregado correctamente");
    })
    .catch((err) => console.error(err));
};


  return (
    <div className="factura-detalle-container">
      <h2 className="factura-detalle-title">
        Factura #{factura.numero || factura.id}{" "}
        <span className={estadoBadge(factura.estado)}>{factura.estado}</span>
      </h2>

      <div className="factura-detalle-info">
        <p>
          <strong>Cliente:</strong> {factura.cliente?.nombre || "Sin cliente"}
        </p>
        <p>
          <strong>Teléfono:</strong> {factura.cliente?.telefono || "N/A"}
        </p>
        <p>
          <strong>Correo:</strong> {factura.cliente?.correo || "N/A"}
        </p>
        <p>
          <strong>Dirección:</strong> {factura.cliente?.direccion || "N/A"}
        </p>
        <p>
          <strong>Fecha:</strong> {factura.fecha?.substring(0, 10) || "N/A"}
        </p>
      </div>

      <h3>Detalles de la factura</h3>
      <table className="factura-detalle-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {factura.detalles?.length > 0 ? (
            factura.detalles.map((d) => (
              <tr key={d.id}>
                <td>{d.producto?.nombre || "N/A"}</td>
                <td>{d.cantidad || 0}</td>
                <td>${d.precioUnitario?.toFixed(2) || 0}</td>
                <td>${d.subtotal?.toFixed(2) || 0}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No hay productos en esta factura.</td>
            </tr>
          )}
        </tbody>
      </table>

      <h3>Total: ${factura.total?.toFixed(2) || 0}</h3>

      {/* Pagos */}
      <div className="factura-pagos">
        <h3>Pagos realizados</h3>
        {factura.pagos?.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Monto</th>
                <th>Método</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {factura.pagos.map((p, i) => (
                <tr key={i}>
                  <td>${p.monto.toFixed(2)}</td>
                  <td>{p.metodo}</td>
                  <td>{p.fechaPago}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No se han registrado pagos.</p>
        )}

        {/* Mostrar formulario solo si la factura no está pagada */}
        {factura.estado !== "PAGADA" && montoPago > 0 && (
          <>
            <h4>Agregar pago</h4>
            <input type="number" value={montoPago} readOnly />
            <select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
            >
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Cheque">Cheque</option>
            </select>
            <input type="date" value={fechaPago} readOnly />
            <button onClick={agregarPago}>Agregar Pago</button>
          </>
        )}
      </div>
    </div>
  );
}

export default FacturaDetalle;
