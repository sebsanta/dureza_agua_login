import { useContext, useState } from "react";
import { UserContext } from "../context/UserProvider";
import { useNavigate } from "react-router-dom";

const Login = () => {
 const [email, setEmail] = useState('sebsnow@seba.cl');
 const [password, setPassword] = useState('123123');


    const {loginUser} = useContext(UserContext);
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log("procesando form: ", email, password);
        try {
            await loginUser(email, password);
            alert("Usuario logueado con exito");
            navigate("/");
        } catch (error) {
            console.log(error)
        }
    }

    
    return (
      <div>
        <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    placeholder="Ingrese email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                    type="password" 
                    placeholder="Ingrese password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
