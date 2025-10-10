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
        <>
    <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header con gradiente */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-10 text-center">
            <div className="mb-4">
              <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center">
                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Bienvenido</h1>
            <p className="text-purple-100 text-sm">Ingresa a tu cuenta para continuar</p>
          </div>
          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-8 py-10">
            <div className="space-y-6">
              {/* Campo de Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  </div>
                    <FormInput
                       // label="Ingresa tu correo"
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
                </div>
              </div>

              {/* Campo de Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  </div>
                    <FormInput
                       // label="Ingresa tu password"
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
                </div>
              </div>
              {/* Botón de Login */}
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-indigo-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg hover:shadow-xl"
              >
                Iniciar Sesión
              </button>
            </div> 
          </div>
          </form>
        </div>
        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            © 2025 TDSLabs. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
    {/* <div>
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
    </div> */}
    </>
    );
}

export default Login;
