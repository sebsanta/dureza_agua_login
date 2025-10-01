import { Route, Routes } from "react-router-dom"
import Login from "./routes/Login"
import Home from "./routes/Home"
import Register from "./routes/Register"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import RequireAuth from "./components/RequireAuth"
import { useContext } from "react"
import { UserContext } from "./context/UserProvider"
import LayoutContainerForm from "./components/LayoutContainerForm"// src/App.tsx
import Locaciones from "./routes/Locaciones"
import MapaLocaciones from "./routes/MapaLocaciones"
import Grafico from "./routes/Grafico"
import Graficos from "./routes/Graficos"

const App = () => {

  const {user} = useContext(UserContext)

  if(user === false){
    return <div>Cargando...</div> 
  } 

  return (
    <div className="app-container">
      <div>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path='/' 
            element={
              <RequireAuth>
                  <Home />
              </RequireAuth>
            }
          />
          <Route path="/" element={<LayoutContainerForm />}>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Route>
            <Route path='/locaciones' element={<RequireAuth><Locaciones/> </RequireAuth>} />
            <Route path='/mapa' element={<RequireAuth><MapaLocaciones/></RequireAuth>} />
            <Route path='/grafico' element={<RequireAuth><Grafico /></RequireAuth>} />
            <Route path='/graficos' element={<RequireAuth><Graficos /></RequireAuth>} />
        </Routes>
      </main>
    </div>
  </div>
  );
};


export default App
