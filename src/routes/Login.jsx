import { useContext } from "react";
import { UserContext } from "../context/UserProvider";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { erroresFirebase } from "../utils/erroresFirebase";
import { formValidate } from "../utils/formValidate";

import FormInput from "../components/FormInput";
import FormError from "../components/FormError";


const Login = () => {

    const {loginUser} = useContext(UserContext);
    const navigate = useNavigate();
    const {required,patternEmail, minLength, maxLength,validateTrim} = formValidate();
    const {register, handleSubmit, formState: {errors}, getValues, setError} = useForm();

    const onSubmit = async({email,password}) => {
           try {
              await loginUser(email, password);
              alert("Login exitoso");
              navigate("/");
               }
           catch (error) {
                const {code, message} = erroresFirebase(error.code);
                setError(code, {
                    message,
                });
            }};   


    return (
      <div>
        <h1>Login</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
            <FormInput
               type="email" 
               placeholder="Ingrese email"
                {...register("email", {
                    required,
                    pattern: patternEmail,
                })}
            ></FormInput>
            <FormError error={errors.email}/>
                <FormInput
                    type="password" 
                    placeholder="Ingrese password" 
                    {...register("password", {
                        required,
                        minLength,
                        maxLength,
                        validateTrim,
                    })}
                >
                </FormInput>
                 <FormError error={errors.password}/>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
