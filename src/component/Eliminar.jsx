import axios from "axios";
import React, { useState } from "react";

function Eliminar({ id, onDelete }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmar = window.confirm("¿Seguro que quieres eliminar este producto?");
    if (!confirmar) return;

    try {
      setLoading(true);

      await axios.delete(`https://inventarios-n618.onrender.com/productos/${id}`);

      if (onDelete) onDelete(id);
    } catch (error) {
      console.error("Error al eliminar:", error);
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
        padding: "5px 10px"
      }}
    >
      {loading ? "Eliminando..." : "Eliminar"}
    </button>
  );
}

export default Eliminar;
