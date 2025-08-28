import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Index() {
    const [productos, setProductos] = useState([]);
    const [search, setSearch] = useState('');

    async function fetchProductos() {
        try {
            const response = await axios.get('http://localhost:8080/productos');
            setProductos(response.data);
        } catch (error) {
            console.error('Error al obtener productos', error);
        }
    }

    useEffect(() => {
        fetchProductos();
    }, []);

    const filterProductos = productos.filter(pro =>
        pro.nombre.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container">
            <div className="sidebar">
                <h2>Menú Inventario</h2>
                <a href="/agregar-producto">Agregar Producto</a>
                <a href="/inventarios">Inventarios</a>
                <a href="/movimientos">Movimientos</a>
                <a href="/reportes">Reportes</a>
            </div>

            <div className="main-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>Lista de Productos</h1>
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
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Precio</th>
                            <th>Cantidad</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filterProductos.length === 0 ? (
                            <tr>
                                <td colSpan="5">No hay productos disponibles</td>
                            </tr>
                        ) : (
                            filterProductos.map((prod) => (
                                <tr key={prod.id}>
                                    <td>{prod.nombre}</td>
                                    <td>{prod.descripcion}</td>
                                    <td>{prod.precio}</td>
                                    <td>{prod.cantidad}</td>
                                    <td>
                                        <Link to={`/inventarios/edita/${prod.id}`}>
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

export default Index;
