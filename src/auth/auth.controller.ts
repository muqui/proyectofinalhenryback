import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SigninDto } from './dto/sign-in.dto';
import { GoogleAuthGuard } from './guard/google-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  register(@Body() createUserDto: CreateUserDto){
      
      return this.authService.createUser(createUserDto)
  }
 
  @Post('signin')
  signin(@Body() signin: SigninDto){
      console.log(signin)
      return this.authService.signin(signin)
  }

    
    @Get('google')
    @UseGuards(GoogleAuthGuard)
    async googleAuth() {
      return { message: 'Redirigiendo a Google...' };
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    googleAuthRedirect(@Req() req) {
     // const token = req.user.token;  // Accedemos directamente al token
      //return { token };  
      return { token: req.user };
    }
}
