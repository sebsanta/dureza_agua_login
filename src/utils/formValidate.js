
export const formValidate = () => {

    return {
                    required:{
                        value: true, 
                        message: "El campo es obligatorio",
                            },
                    patternEmail: {
                        value:/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*(\.[a-z]{2,15})$/,
                        message: "Formato del email no es correcto"
                            },
                    minLength: {
                        value: 6,
                        message: "Minimo 6 caracteres",
                            },
                    maxLength: {
                        value: 12, 
                        message: "Maximo 12 caracteres",
                            },
                    validate: {
                        equals: (value) => value === getValues("password")||
                        "Las contraseñas no coinciden",
                    },
                    validateTrim: {
                        trim: (v) => {
                        if (!v.trim()) {
                            return "No puede ir vacio o con espacios";
                    }
                    return true;
                    }},
    };
}   