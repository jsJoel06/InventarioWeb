import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';


function EditarMovimiento() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movimiento, setMovimiento] = useState({
    producto: { id: '', nombre: '', descripcion: '', precio: '', cantidad: '' },
    cantidad: '',
    tipo: '',
    fecha: '',
    descripcion: ''
  });

  useEffect(() => {
    const fetchMovimiento = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/movimientos/${id}`);
        setMovimiento(res.data);
      } catch (err) {
        console.error('Error al obtener el movimiento:', err);
      }
    };
    fetchMovimiento();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("producto.")) {
      const field = name.split(".")[1];
      setMovimiento(prev => ({
        ...prev,
        producto: {
          ...prev.producto,
          [field]: value
        }
      }));
    } else {
      setMovimiento(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // La fecha se actualiza automáticamente al día actual
      const hoy = new Date().toISOString().split('T')[0];
      const movimientoActualizado = { ...movimiento, fecha: hoy };

      await axios.put(`http://localhost:8080/movimientos/${id}`, movimientoActualizado);
      alert('Movimiento actualizado con éxito');
      navigate('/movimientos');
    } catch (error) {
      console.error('Error al actualizar el movimiento:', error);
      alert('Error al actualizar el movimiento');
    }
  };

  return (
    <div className="form-content">
      <form onSubmit={handleSubmit}>
        <h1>Editar Movimiento</h1>

        <div>
          <label>Producto:</label>
          <input
            type="text"
            name="producto.nombre"
            value={movimiento.producto?.nombre || ''}
            disabled
          />
        </div>

        <div>
          <label>Cantidad:</label>
          <input
            type="number"
            name="cantidad"
            value={movimiento.cantidad}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Tipo:</label>
          <select name="tipo" value={movimiento.tipo} onChange={handleChange} required>
            <option value="ENTRADA">ENTRADA</option>
            <option value="SALIDA">SALIDA</option>
          </select>
        </div>

        <div>
          <label>Descripción:</label>
          <input
            type="text"
            name="descripcion"
            value={movimiento.descripcion}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Guardar</button>
      </form>
    </div>
  );
}

export default EditarMovimiento;



