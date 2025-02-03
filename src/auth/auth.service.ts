import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SigninDto } from './dto/sign-in.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/user/roles.enum';

@Injectable()
export class AuthService {
   

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService 
    ) { }


  async signin({ email, password }: SigninDto) {

    const user = await this.userService.findOneByEmail(email)

    //console.log(user);

    if (!user) {
        throw new UnauthorizedException('email or password incorrect')
    }

    const isPasswordValided = await bcrypt.compare(password, user.password)

    if (!isPasswordValided) {
        throw new UnauthorizedException('email or password  is wrong')
    }

    const payLoad = {
        email: user.email,
        id: user.id,
        roles: [user.isAdmin? Role.Admin : Role.User]
        /*
        roles: [
            user.isAdmin === 'admin'
                ? Role.Admin
                : user.isAdmin === 'superadmin'
                    ? Role.SuperAdmin
                    : Role.User
        ],
       
        roles: [
            user.isAdmin === UserRole.ADMIN
                ? Role.Admin
                : user.isAdmin === UserRole.SUPERADMIN
                    ? Role.SuperAdmin
                    : Role.User
        ],
         */
    }

    console.log('Payload antes de firmar el token:', payLoad);  // Verifica que el payload está correcto
    const token = await this.jwtService.signAsync(payLoad);
    return { token };


    
  }

  async createUser(createUserDto: CreateUserDto) {
    
   
  
    return this.userService.create(createUserDto);
   
    
  }
  async googleLogin(user: { googleId: any; email: any; name: string; profilePicture: any; }) {
    if (!user.email) {
      throw new UnauthorizedException('Google authentication failed: No email found.');
    }

    // Buscar usuario en la base de datos por email
    let existingUser = await this.userService.findOneByEmail(user.email);

    // Si no existe, lo creamos en la base de datos
    if (!existingUser) {
      const newUser = {
        email: user.email,
        name: user.name,
        provider: "google",
        password: null, // Google users don't have a password
        isAdmin: false, // Si quieres manejar roles
      };

      existingUser = await this.userService.create(newUser);
    }

    // Generar Token JWT
    const payload = {
      email: existingUser.email,
      roles: [existingUser.isAdmin ? Role.Admin : Role.User],
    };

    const token = await this.jwtService.signAsync(payload);

    // Regresar el token en el formato solicitado
    return  token ;
}

  /*
  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
    */
}
