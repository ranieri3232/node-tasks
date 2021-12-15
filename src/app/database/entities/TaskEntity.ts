import {
  Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { TaskPriority } from '../migrations/1639506464512-CreateTasks';
import { UserEntity } from './UserEntity';

@Entity('tasks')
export class TaskEntity {
	@PrimaryGeneratedColumn()
	  id: string;

	@Column()
	  title: string;

	@Column()
	  description: string;

	@Column({
	  type: 'enum',
	  enum: TaskPriority,
	  default: TaskPriority.DEFAULT,
	})
	  priority: TaskPriority;

	@ManyToOne(() => UserEntity)
	@JoinColumn({ name: 'user_id' })
	  user: UserEntity;

	@Column()
	  user_id: string;

	@CreateDateColumn({ type: 'timestamp', default: () => 'now()' })
	  created_at: Date;

	@UpdateDateColumn({ type: 'timestamp', default: () => 'now()', onUpdate: 'now()' })
	  updated_at: Date;
}
