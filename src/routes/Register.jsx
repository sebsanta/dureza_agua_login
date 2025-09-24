import { useContext, useState } from "react";
import { UserContext } from "../context/UserProvider";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const Register = () => {


    const navigate = useNavigate();
    const {registerUser} = useContext(UserContext);
    const {register, handleSubmit, formState: {errors}, getValues, setError} = useForm();

    const onSubmit = async(data) => {
           try {
              await registerUser(data.email, data.password);
              alert("Usuario registrado con exito");
              navigate("/");
               }
           catch (error) {
              switch (error.code) {
                case "auth/email-already-in-use":
                  setError("email", {
                    message: "El email ya fue registrado anteriormente"
                  });
                  break;
                case "auth/invalid-email":
                  setError("email", {
                    message: "El email no es válido"
                  });
                  break;
                default:
                  console.log("Ocurrió un error en el registro" + error.code);
              }    
            }}

  return (
    <>
        <div>Register</div>
        <form onSubmit={handleSubmit(onSubmit)}>
            <input 
                type="email" 
                placeholder="Ingrese email"
                {...register("email", {
                    required:{
                        value: true, 
                        message: "El email es obligatorio"
                    },
                    pattern: {
                        //value: true,
                        value:/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*(\.[a-z]{2,15})$/,
                        message: "Formato del email no es correcto"
                    },
            })}
            />
            {errors.email && <p>{errors.email.message}</p>}
            <input 
                type="password" 
                placeholder="Ingrese password" 
                {...register("password", 
                    {setValueAs: (value) => value.trim(),
                     minLength: {value: 6,
                                 message: "Minimo 6 caracteres"},
                                 },
                    {setValueAs: (value) => value.trim(),
                     maxLength: {value: 12, 
                                 message: "Maximo 12 caracteres"},
                                },
                  )}
            />
            {errors.password && <p>{errors.password.message}</p>}
            <input 
                type="password" 
                placeholder="Reingrese password" 
                {...register("repassword", 
                    {validate: {
                        equals: (value) => value === getValues("password")||
                        "Las contraseñas no coinciden",
                    }},
                    {setValueAs: (value) => value.trim(),
                     minLength: {value: 6,
                                 message: "Minimo 6 caracteres"}},
                    {setValueAs: (value) => value.trim(),
                     maxLength: {value: 12, 
                                 message: "Maximo 12 caracteres"}})}
            />
            {errors.repassword && <p>{errors.repassword.message}</p>}
            <button type="submit">Register</button>
        </form>
    </>
  )
}

export default Register;