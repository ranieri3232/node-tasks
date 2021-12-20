/* eslint-disable radix */
/* eslint-disable arrow-body-style */
import { Request, Response, Router } from 'express';
import { TaskService } from '../services/TaskService';

type TaskListRequest = {
  limit: string | undefined;
  offset: string | undefined;
}
export type TaskProps = {
	title: string | undefined;
	description: string | undefined;
	priority: string | undefined;
	user_id: string;
}

class TaskController {
  public router: Router;

  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
    this.router = Router();
    this.routes();
  }

  private index = async (req: Request, res: Response) => {
    const { limit, offset } = req.query as TaskListRequest;
    const { user_id } = req;
    const take = parseInt(limit);
    const skip = parseInt(offset);
    const [tasks, total] = await this.taskService.index({ take, skip, user_id });
    return res.send({ tasks, total });
  };

  private create = async (req: Request, res: Response) => {
    const { user_id } = req;
    const {
      title, description, priority,
    } = req.body as TaskProps;
    try {
      const task = await this.taskService.create({
        title, description, priority, user_id,
      });
      return res.send({ task });
    } catch (err) {
      return res.status(400).send({ message: err.message });
    }
  };

  private update = async (req: Request, res: Response) => {
    const { user_id } = req;
    const { title, description, priority } = req.body as TaskProps;
    const { id } = req.params;
    try {
      const task = await this.taskService.update(id, {
        title, description, priority, user_id,
      });
      return res.send(task);
    } catch (err) {
      return res.status(400).send({ message: err.message });
    }
  };

  private delete = async (req: Request, res: Response) => {
    const { user_id } = req;
    const { id } = req.params;
    try {
      const result = await this.taskService.delete(id, user_id);
      return res.send({ message: result });
    } catch (err) {
      return res.status(400).send({ message: err.message });
    }
  };

  private routes() {
    this.router.get('/', this.index);
    this.router.post('/', this.create);
    this.router.put('/:id', this.update);
    this.router.delete('/:id', this.delete);
  }
}

export { TaskController };
