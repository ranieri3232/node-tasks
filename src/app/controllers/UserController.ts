/* eslint-disable arrow-body-style */
import { Request, Response, Router } from 'express';
import { UserService } from '../services/UserService';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

export type UserRequest = {
    username: string;
    name: string;
    password: string;
    email: string;
}
export class UserController {
  public router: Router;

  private userService: UserService;

  constructor() {
    this.userService = new UserService();
    this.router = Router();
    this.routes();
  }

  private create = async (req: Request, res: Response) => {
    const user:UserRequest = req.body;
    if (!user.name || !user.email || !user.password || !user.username) {
      return res.sendStatus(422);
    }
    try {
      const userCreated = await this.userService.create(user);
      return res.send({
        message: 'User created successfully',
        user: userCreated,
      });
    } catch (err) {
      res.statusCode = 409;
      return res.send({ message: `Cannot create a user. ${err.message}` });
    }
  };

  private index = async (req: Request, res: Response) => {
    const { user_id } = req;
    try {
      const result = await this.userService.index(user_id);
      return res.send(result);
    } catch (err) {
      res.statusCode = 409;
      return res.send({ message: err.message });
    }
  };

  private update = async (req: Request, res: Response) => {
    const { user_id } = req;
    const { name, email, username } = req.body;
    try {
      const userUpdated = await this.userService.update({
        id: user_id, name, email, username,
      });
      return res.send({ userUpdated });
    } catch (err) {
      res.statusCode = 409;
      return res.send({ message: `cannot update this user. ${err.message}` });
    }
  };

  private delete = async (req: Request, res: Response) => {
    const { password } = req.body;
    const { user_id } = req;
    try {
      const result = await this.userService.delete(user_id, password);
      return res.send(result);
    } catch (err) {
      return res.send({ message: err.message });
    }
  };

  private routes() {
    this.router.get('/', ensureAuthenticated, this.index);
    this.router.post('/', this.create);
    this.router.put('/', ensureAuthenticated, this.update);
    this.router.delete('/', ensureAuthenticated, this.delete);
  }
}
