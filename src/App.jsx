import { Route, Routes } from "react-router-dom"
import Login from "./routes/Login"
import Home from "./routes/Home"
import Register from "./routes/Register"
import Navbar from "./components/Navbar"
import RequireAuth from "./components/RequireAuth"
import { useContext } from "react"
import { UserContext } from "./context/UserProvider"



const App = () => {

  const {user} = useContext(UserContext)

  if(user === false){
    return <div>Cargando...</div> 
  } 

  return (
    <> 
    <Navbar />
      <h1>APP Aguas</h1>
      <Routes>
        <Route path='/' 
          element={
             <RequireAuth>
                <Home />
            </RequireAuth>
          }
        />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </>
  );
};


export default App
