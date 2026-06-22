import {ValidationError}  from "@hrmanagement/error-handler"



const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;


/** Şifre
 * en az 8 karakter
en az 1 küçük harf
en az 1 büyük harf
en az 1 rakam
en az 1 özel karakter
 */

const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/g;


export const validateRegistirationData = (data: any) => {
    const {name,email,password,role} = data;
    
    if(!name || !email || !password || !role ){
        return new ValidationError(`Missing Required fields!`)
    }

    if(!passwordRegex.test(password)){
        return new ValidationError(`Invalid email format`)
    }

    if(!emailRegex.test(email)){
        return new ValidationError(`Invalid email format`)
    }

    return true;

}