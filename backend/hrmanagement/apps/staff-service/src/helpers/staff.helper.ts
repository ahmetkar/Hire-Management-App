import { ValidationError } from "@hrmanagement/error-handler";

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;


export const validateEmailData = (email: string) => {

    
    if(!emailRegex.test(email)){
        return new ValidationError(`Invalid email format`)
    }
    return true;
}