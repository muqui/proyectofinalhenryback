import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: string;
  
    @Column({ type: 'varchar', length: 255 }) // Nombre del producto
    name: string;

   

    @Column({ type: 'varchar', length: 255, unique: true  }) // Nombre del producto
    email: string;

    @Column({ nullable: true })
    password: string;

    @Column({default: 'local'})
    provider: string

   @Column({default: false})
    isAdmin: boolean;

   

   
    @Column({type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;
  
  
}
