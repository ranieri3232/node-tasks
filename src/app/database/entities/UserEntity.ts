import {
  Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
	@PrimaryGeneratedColumn()
	  id: string;

	@Column()
	  username: string;

	@Column()
	  email: string;

	@Column()
	  passowrd: string;

	@Column()
	  name: string;

	@CreateDateColumn({ type: 'timestamp', default: () => 'now()' })
	  created_at: Date;

	@UpdateDateColumn({ type: 'timestamp', default: () => 'now()', onUpdate: 'now()' })
	  updated_at: Date;
}
