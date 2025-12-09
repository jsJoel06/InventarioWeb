import { useEffect, useState } from "react";
import "./FacturaNueva.css";

function FacturaNueva() {
  const [cliente, setCliente] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
    correo: "",
  });
  const [productos, setProductos] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/productos")
      .then((res) => res.json())
      .then((data) => setProductos(Array.isArray(data) ? data : data.data || []))
      .catch((err) => console.error("Error al obtener productos:", err));
  }, []);

  const agregarItem = () => {
    setItems([
      ...items,
      { productoId: "", cantidad: 1, precioUnitario: 0, subtotal: 0 },
    ]);
  };

  const actualizarItem = (index, field, value) => {
    const nuevos = [...items];
    nuevos[index][field] = field === "cantidad" ? Number(value) : value;

    const prod = productos.find((p) => p.id == nuevos[index].productoId);
    if (prod) {
      nuevos[index].precioUnitario = prod.precio;
      nuevos[index].subtotal = prod.precio * nuevos[index].cantidad;
    } else {
      nuevos[index].precioUnitario = 0;
      nuevos[index].subtotal = 0;
    }

    setItems(nuevos);
  };

  const totalFactura = items.reduce((acc, item) => acc + item.subtotal, 0);

  const guardarFactura = async () => {
    // Validaciones
    if (!cliente.nombre || !cliente.telefono || !cliente.correo) {
      alert("Por favor complete todos los datos del cliente.");
      return;
    }
    if (items.length === 0) {
      alert("Agregue al menos un producto.");
      return;
    }
    if (items.some((i) => !i.productoId)) {
      alert("Seleccione todos los productos antes de guardar.");
      return;
    }

    // Crear objeto para enviar al backend
    const factura = {
      cliente: {
        nombre: cliente.nombre,
        telefono: cliente.telefono,
        direccion: cliente.direccion,
        correo: cliente.correo,
      },
      detalles: items.map((i) => ({
        productoId: i.productoId,
        cantidad: i.cantidad,
      })),
    };

    try {
      const res = await fetch("http://localhost:8080/facturas/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(factura),
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error("Error backend:", errData);
        alert("Ocurrió un error al crear la factura. Revisa la consola.");
        return;
      }

      const data = await res.json();
      console.log("Factura creada:", data);

      // ✅ No abrir PDF automáticamente
      alert("Factura guardada correctamente.");

      // Reset formulario
      setCliente({ nombre: "", telefono: "", direccion: "", correo: "" });
      setItems([]);
    } catch (err) {
      console.error("Error al crear factura:", err);
      alert("Error de conexión con el backend.");
    }
  };

  return (
    <div className="factura-nueva-container">
      {/* Header y cliente */}
      <div className="factura-header-card">
        <h2 className="factura-header-title">🧾 Crear Factura</h2>
        <div className="cliente-form">
          <input
            type="text"
            className="input-cliente"
            placeholder="Nombre del cliente"
            value={cliente.nombre}
            onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
          />
          <input
            type="text"
            className="input-cliente"
            placeholder="Teléfono"
            value={cliente.telefono}
            onChange={(e) =>
              setCliente({ ...cliente, telefono: e.target.value })
            }
          />
          <input
            type="text"
            className="input-cliente"
            placeholder="Dirección"
            value={cliente.direccion}
            onChange={(e) =>
              setCliente({ ...cliente, direccion: e.target.value })
            }
          />
          <input
            type="email"
            className="input-cliente"
            placeholder="Correo electrónico"
            value={cliente.correo}
            onChange={(e) => setCliente({ ...cliente, correo: e.target.value })}
          />
        </div>
      </div>

      {/* Productos */}
      <div className="productos-card">
        <button className="btn-agregar-producto" onClick={agregarItem}>
          + Agregar Producto
        </button>

        {items.map((item, i) => (
          <div key={i} className="producto-item-card">
            <div className="producto-item-row">
              <select
                className="select-producto"
                value={item.productoId}
                onChange={(e) =>
                  actualizarItem(i, "productoId", e.target.value)
                }
              >
                <option value="">Seleccione producto</option>
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} (${p.precio})
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                className="input-cantidad"
                value={item.cantidad}
                onChange={(e) => actualizarItem(i, "cantidad", e.target.value)}
              />

              <div className="producto-precio">
                <p>
                  Precio: <b>${item.precioUnitario}</b>
                </p>
                <p>
                  Subtotal: <b>${item.subtotal}</b>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total y botón */}
      <div className="factura-footer">
        <h4>
          Total: <span className="total-valor">${totalFactura}</span>
        </h4>
        <button className="btn-guardar" onClick={guardarFactura}>
          💾 Guardar Factura
        </button>
      </div>
    </div>
  );
}

export default FacturaNueva;
