import {
  Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import bcrypt from 'bcrypt';

@Entity('users')
export class UserEntity {
	@PrimaryGeneratedColumn()
	  id: string;

	@Column()
	  username: string;

	@Column()
	  email: string;

	@Column()
	  password: string;

	@Column()
	  name: string;

	@CreateDateColumn({ type: 'timestamp', default: () => 'now()' })
	  created_at: Date;

	@UpdateDateColumn({ type: 'timestamp', default: () => 'now()', onUpdate: 'now()' })
	  updated_at: Date;

	@BeforeInsert()
	async hashPassword() {
	  this.password = await bcrypt.hash(this.password, 8);
	}
}
