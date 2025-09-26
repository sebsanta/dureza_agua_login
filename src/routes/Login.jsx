import { useContext } from "react";
import { UserContext } from "../context/UserProvider";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { erroresFirebase } from "../utils/erroresFirebase";
import { formValidate } from "../utils/formValidate";


import FormError from "../components/FormError";
import FormInput from "../components/FormInput";

const Login = () => {

    const {register, handleSubmit, formState: {errors}, getValues, setError} = useForm();
    const {required,patternEmail, minLength, maxLength,validateTrim} = formValidate();
    const {loginUser} = useContext(UserContext);
    const navigate = useNavigate();

    const onSubmit = async(data) => {
           try {
              await loginUser(data.email, data.password);
              alert("Login exitoso");
              navigate("/");
               }
           catch (error) {
                console.log(error);
                setError("firebase", {
                    message: erroresFirebase(error.code),
                });
            }};   


    return (
      <div>
        <h1>Login</h1>
         <FormError error={errors.firebase}/>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormInput
                    type="email" 
                    placeholder="Ingrese email"
                        {...register("email", {
                            required,
                            pattern: patternEmail,
                        })}
                >
                <FormError error={errors.email}/>
                </FormInput>
                <FormInput
                    type="password" 
                    placeholder="Ingrese password" 
                    {...register("password", {
                        required,
                        minLength,
                        maxLength,
                        validate: validateTrim,
                    })}
                >
                <FormError error={errors.password}/>
                </FormInput>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
