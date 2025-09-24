import { createUserWithEmailAndPassword, 
         signInWithEmailAndPassword, 
         signOut,
         onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react"
import { auth } from "../firebase";

export const UserContext = createContext();

const UserProvider = ({children}) => {
    const [user, setUser] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            console.log("Estado de usuario: ", user);
            if (user){
                const {accessToken, email, uuid, displayName, photoURL} = user;
                setUser(accessToken, email, uuid, displayName, photoURL);
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    //funcion para registrar usuario
    const registerUser = (email, password) => 
        createUserWithEmailAndPassword(auth, email, password);

    //funcion para loguear usuario
    const loginUser = (email, password) =>
        signInWithEmailAndPassword(auth, email, password);

    //funcion para cerrar sesion
    const signOutUser = () => signOut(auth);   


    return (
        <UserContext.Provider value={{user, setUser, registerUser, loginUser, signOutUser}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider