export const erroresFirebase = (code) => {
    let mensaje = '';
    switch (code) {
        case 'auth/email-already-in-use':
            return{
                code:"email",
                message: 'El correo ya está en uso'  
            }
        case 'auth/invalid-email':
            return{
                code: "email",
                message : 'El correo no es válido'
            }
        case 'auth/weak-password':
            return {
                code:"password",
                message: 'La contraseña debe tener al menos 6 caracteres',
            }
        case 'auth/user-not-found':
            return{
                code: "usuario",
                message : 'Usuario no encontrado',
            }
        case 'auth/wrong-password':
            return{
                code: "password",
                message : 'Contraseña incorrecta',
            }
        default:
            return{
                code: "email",
                message : 'Error desconocido',
            }
    }
    return mensaje;
}