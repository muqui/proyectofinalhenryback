import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import {config as dotenvConfig} from 'dotenv'

dotenvConfig({path: '.env.development'});

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { id, name, emails, photos } = profile;
    const user = {
      googleId: id,
      email: emails[0].value,
      name: name.givenName + ' ' + name.familyName,
      profilePicture: photos[0].value,
    };

    //Pasamos el usuario al AuthService para registrarlo o encontrarlo
    const token = await this.authService.googleLogin(user);
    //done(null, authenticatedUser);
    //console.log(token)
    //done(null, { token });
      // Asegúrate de que `token` es una cadena, no un objeto
      done(null, token); 
  }
}
