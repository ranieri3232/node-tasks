import { EntityRepository, Repository } from 'typeorm';
import { TaskEntity } from '../database/entities/TaskEntity';

@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity> {

}
