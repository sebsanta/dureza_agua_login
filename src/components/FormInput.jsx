import { forwardRef } from "react";

const FormInput = forwardRef(({type, placeholder, onChange, onBlur, name}, ref) => {
  return (
    <input 
            type={type} 
            placeholder={placeholder} 
            ref={ref} 
            onChange={onChange} 
            onBlur={onBlur} 
            name={name}
    />
)});

export default FormInput;