import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
){}
 
  async create(createUserDto: CreateUserDto) {
       // Verificar si el correo ya existe
       const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
  
      // Si ya existe, lanzar una excepción
      if (existingUser) {
        throw new ConflictException('Email already in use');
      }
  
      // Si no existe, guardar el nuevo usuario
      if (createUserDto.password) {
        createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
      }
      
      const user = this.userRepository.create(createUserDto);
      return this.userRepository.save(user);
    
  }

  findOneByEmail(email: string){
    return this.userRepository.findOneBy({email})
  }   

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
