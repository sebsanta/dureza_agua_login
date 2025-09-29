import { useContext } from "react";
import { UserContext } from "../context/UserProvider";
import { Form, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { erroresFirebase } from "../utils/erroresFirebase";
import { formValidate } from "../utils/formValidate";


import FormInput from "../components/FormInput";
import FormError from "../components/FormError";
import FormTitle from "../components/FormTitle";
import Button from "../components/Button";

const Register = () => {


    const navigate = useNavigate();
    const {registerUser} = useContext(UserContext);
    const {register, handleSubmit, formState: {errors}, getValues, setError} = useForm();
    const {required,patternEmail, minLength, maxLength,validateTrim} = formValidate();

    const onSubmit = async(data) => {
           try {
              await registerUser(data.email, data.password);
              alert("Usuario registrado con exito");
              navigate("/");
               }
           catch (error) {
                setError("email", {
                    message: erroresFirebase(error.code),
                });
            }};

  return (
    <>
        <FormTitle text="Registro de Usuarios"/>
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormInput
                type="email" 
                placeholder="Ingrese email"
                    {...register("email", {
                        required,
                        pattern: patternEmail,
                    })}
                label="Ingresa tu correo"
                id="email-address-icon"
                error={errors.email}
            >
            </FormInput>
            <FormError error={errors.email}/>
            <FormInput
                type="password" 
                placeholder="Ingrese password" 
                 {...register("password", {
                    required,
                    minLength,
                    maxLength,
                    validate: validateTrim,
                 })}
                label="Ingresa tu password"
                error={errors.password}
            >
            </FormInput>
            <FormError error={errors.password}/>
            <FormInput
                type="password" 
                placeholder="Reingrese password" 
                {...register("repassword", 
                    {
                        required,
                        minLength, 
                        maxLength,
                        validateTrim,
                        validate: {
                        equals: (value) => value === getValues("password")||
                        "Las contraseñas no coinciden",
                    }},
                    {setValueAs: (value) => value.trim()},
                    )}
                label="Reingresa tu password"
                error={errors.repassword}
            >
            </FormInput>
            <FormError error={errors.repassword}/> 
            <Button text="Registrarse" type="sumbit"/>
        </form>
    </>
  )
}

export default Register;