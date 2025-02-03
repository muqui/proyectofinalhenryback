import { Transform } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";


export class SigninDto {
  
         /**
     * Debe ser un correo valido
     * @example muqui@hotmail.com
     */
         @IsEmail()
         email: string;
         /**
          * La contraseña debe ser dificil
          * @example 123456
          */
          @Transform(({value})=> value.trim())
         @MinLength(1)
         @IsString()  
         password : string;

}