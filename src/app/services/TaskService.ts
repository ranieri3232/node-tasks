/* eslint-disable arrow-body-style */
import { getCustomRepository } from 'typeorm';
import { TaskProps } from '../controllers/TaskController';
import { TaskPriority } from '../database/migrations/1639506464512-CreateTasks';
import { TaskRepository } from '../repository/TaskRepository';

type TaskListProps = {
  take: number | undefined;
  skip: number | undefined;
  user_id: string;
}

class TaskService {
  private taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = getCustomRepository(TaskRepository);
  }

  public index = async ({ take = 10, skip = 0, user_id }: TaskListProps) => {
    const [tasks, total] = await this.taskRepository.findAndCount({
      where: { user_id },
      take,
      skip,
    });

    return [tasks, total];
  };

  public create = async ({
    title, description, priority, user_id,
  }: TaskProps) => {
    const task = this.taskRepository.create({
      title, description, user_id, priority: TaskPriority[priority],
    });
    try {
      const newTask = await this.taskRepository.save(task);
      return newTask;
    } catch {
      throw new Error('Cannot create a new task');
    }
  };

  public update = async (id: string, {
    title, description, priority, user_id,
  }:TaskProps) => {
    const task = await this.taskRepository.findOne(id);
    if (!task) {
      throw new Error('Task does not exists.');
    }
    if (task.user_id !== user_id) {
      throw new Error('The task does not belong to the user.');
    }
    task.title = title ?? task.title;
    task.priority = priority ? TaskPriority[priority] : task.priority;
    task.description = description ?? task.description;
    try {
      await this.taskRepository.save(task);
    } catch {
      throw new Error('Cannot update the task');
    }
    return task;
  };

  public delete = async (id: string, user_id: string) => {
    const task = await this.taskRepository.findOne(id);
    if (!task) {
      throw new Error('task does not exists.');
    }
    if (task.user_id !== user_id) {
      throw new Error('The task does not belong to the user.');
    }
    await this.taskRepository.delete(id);
    return `Successfully delete the task by id:${id}`;
  };
}
export { TaskService };
