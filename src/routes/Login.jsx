import { useContext } from "react";
import { UserContext } from "../context/UserProvider";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { erroresFirebase } from "../utils/erroresFirebase";
import { formValidate } from "../utils/formValidate";


import FormError from "../components/FormError";
import FormInput from "../components/FormInput";
import FormTitle from "../components/FormTitle";
import Button from "../components/Button";
import Footer from "../components/Footer";

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
      <div>
        <FormTitle text="Login"/>
         <FormError error={errors.firebase}/>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormInput
                    label="Ingresa tu correo"
                    type="email" 
                    placeholder="Ingrese email"
                        {...register("email", {
                            required,
                            pattern: patternEmail,
                        })}
                     error={errors.email}
                >
                <FormError error={errors.email}/>
                </FormInput>
                <FormInput
                    label="Ingresa tu password"
                    type="password" 
                    placeholder="Ingrese password" 
                    {...register("password", {
                        required,
                        minLength,
                        maxLength,
                        validate: validateTrim,
                    })}
                     error={errors.password}
                >
                <FormError error={errors.password}/>
                </FormInput>
                <Button text="Login"/>
            </form>
        </div>
    </div>
    );
}

export default Login;
