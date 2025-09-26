export const erroresFirebase = (code) => {
    let mensaje = '';
    switch (code) {
        case 'auth/email-already-in-use':
            mensaje = 'El correo ya está en uso';
            break;
        case 'auth/invalid-email':
            mensaje = 'El correo no es válido';
            break;
        case 'auth/weak-password':
            mensaje = 'La contraseña debe tener al menos 6 caracteres';
            break;
        case 'auth/user-not-found':
            mensaje = 'Usuario no encontrado';
            break;
        case 'auth/wrong-password':
            mensaje = 'Contraseña incorrecta';
            break;
        default:
            mensaje = 'Error desconocido';
            break;
    }
    return mensaje;
}