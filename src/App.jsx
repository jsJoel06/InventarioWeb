import { Route, Routes } from "react-router-dom"
import Index from "./component/Index"
import Inventario from "./component/Inventario"
import Movimientos from "./component/Movinientos"
import AgregarProducto from "./component/AgregarProducto"
import AgregarMovimiento from "./component/AgregarMovimientos"
import EditarMovimiento from "./component/EditarMovimiento"
import EditarProducto from "./component/EditarProducto"



function App() {
  

  return (
    <>
    <Routes>
      <Route path="/" element={<Index/>}/>
      <Route path="/inventarios" element={<Inventario/>}/>
      <Route path="/movimientos" element={<Movimientos/>}/>
      <Route path="/agregar-producto" element={<AgregarProducto/>}/>
      <Route path="/agregar-movimiento" element={<AgregarMovimiento/>}/>
      <Route path="/movimientos/editar/:id" element={<EditarMovimiento/>}/>
      <Route path="/inventarios/edita/:id" element={<EditarProducto />} />
      
    </Routes>
    </>
  )
}

export default App
