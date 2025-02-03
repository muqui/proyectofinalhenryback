import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {

    /**
         * debe es un correo valido y unico en la base de datos
         * @example Albert
         */
    @IsString()
    @MinLength(1)
    name: string;

    /**
         * debe es un correo valido y unico en la base de datos
         * @example muqui@hotmail.com
         */
    @IsString()
    @MinLength(1)
    @IsEmail()
    email: string;


    /**
         * password
         * @example 123456
         */
    @IsString()
    @MinLength(6)
    password: string;


    @IsString()
    provider?: string;


}
