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

  public create = async (req: Request, res: Response) => {
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

  public index = async (req: Request, res: Response) => {
    const { userId } = req;
    try {
      const result = await this.userService.index(userId);
      return res.send(result);
    } catch (err) {
      res.statusCode = 409;
      return res.send({ message: err.message });
    }
  };

  public update = async (req: Request, res: Response) => {
    const { userId } = req;
    console.log(userId);
    const { name, email, username } = req.body;
    try {
      const userUpdated = await this.userService.update({
        id: userId, name, email, username,
      });
      return res.send({ userUpdated });
    } catch (err) {
      res.statusCode = 409;
      return res.send({ message: `cannot update this user. ${err.message}` });
    }
  };

  public delete = async (req: Request, res: Response) => {
    const { password } = req.body;
    const { userId } = req;
    console.log(userId, password);
    try {
      const result = await this.userService.delete(userId, password);
      return res.send(result);
    } catch (err) {
      return res.send({ message: err.message });
    }
  };

  public routes() {
    this.router.get('/', ensureAuthenticated, this.index);
    this.router.post('/', this.create);
    this.router.put('/', ensureAuthenticated, this.update);
    this.router.delete('/', ensureAuthenticated, this.delete);
  }
}
