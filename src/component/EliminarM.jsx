import axios from "axios";
import React, { useState } from "react";

function EliminarM({ id, onDelete }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    console.log("ID QUE LLEGA A REACT:", id); // 👈 DEPURACIÓN

    const confirmar = window.confirm("¿Seguro que quieres eliminar este movimiento?");
    if (!confirmar) return;

    try {
      setLoading(true);
      await axios.delete(`${import.meta.env.VITE_API_URL}/movimientos/${id}`);


      if (onDelete) onDelete(id);
    } catch (error) {
      console.error("Error al eliminar movimiento:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      style={{
        color: "white",
        cursor: "pointer",
        background: "red",
        marginLeft: "10px",
        border: "none",
        borderRadius: "3px",
        padding: "5px 10px",
      }}
    >
      {loading ? "Eliminando..." : "Eliminar"}
    </button>
  );
}

export default EliminarM;
