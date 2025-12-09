import { Route, Routes, Navigate } from "react-router-dom";
import Index from "./component/Index";
import Inventario from "./component/Inventario";
import Movimientos from "./component/Movimientos";
import AgregarProducto from "./component/AgregarProducto";
import AgregarMovimiento from "./component/AgregarMovimientos";
import EditarMovimiento from "./component/EditarMovimiento";
import EditarProducto from "./component/EditarProducto";
import Login from "./component/Login";
import HistorialFacturas from "./component/facturas/HistorialFacturas";
import Register from "./component/Register";

// FACTURA COMPONENTS
import FacturaList from "./component/facturas/FacturaList";
import FacturaDetalle from "./component/facturas/FacturaDetalle";
import FacturaNueva from "./component/facturas/FacturaNueva";

function App() {
  const userRole = localStorage.getItem("userRole") || "";

  const RequireAdmin = ({ children }) => {
    return userRole === "ADMIN" ? children : <Navigate to="/index" />;
  };

  const RequireLogin = ({ children }) => {
    return userRole ? children : <Navigate to="/" />;
  };

  return (
    <Routes>
  {/* Login */}
  <Route path="/" element={<Login />} />
  <Route path="/registro" element={<Register />} />

  {/* Rutas accesibles a todos los usuarios logueados */}
  <Route path="/index" element={<Index userRole={userRole} />} />
  <Route path="/inventarios" element={<Inventario />} />
  <Route path="/movimientos" element={<Movimientos />} />
  <Route path="/facturas/historial" element={<HistorialFacturas/>}/>

  {/* FACTURAS */}
  <Route
    path="/facturas"
    element={
      <RequireLogin>
        <FacturaList />
      </RequireLogin>
    }
  />

  <Route
    path="/facturas/crear"
    element={
      <RequireAdmin>
        <FacturaNueva />
      </RequireAdmin>
    }
  />

  <Route
    path="/facturas/:id"
    element={
      <RequireLogin>
        <FacturaDetalle />
      </RequireLogin>
    }
  />

  <Route
    path="/historial/:clienteId"
    element={
      <RequireLogin>
        <HistorialFacturas />
      </RequireLogin>
    }
  />

  {/* Rutas solo para ADMIN */}
  <Route
    path="/agregar-producto"
    element={
      <RequireAdmin>
        <AgregarProducto />
      </RequireAdmin>
    }
  />

  <Route
    path="/inventarios/edita/:id"
    element={
      <RequireAdmin>
        <EditarProducto />
      </RequireAdmin>
    }
  />

  <Route
    path="/agregar-movimiento"
    element={
      <RequireAdmin>
        <AgregarMovimiento />
      </RequireAdmin>
    }
  />

  <Route
    path="/movimientos/editar/:id"
    element={
      <RequireAdmin>
        <EditarMovimiento />
      </RequireAdmin>
    }
  />
</Routes>

  );
}

export default App;
