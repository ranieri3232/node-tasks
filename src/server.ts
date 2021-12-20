import express, { Request, Response } from 'express';
import 'dotenv/config';

import { AuthenticateUserController } from './app/controllers/AuthenticateUserController';
import { UserController } from './app/controllers/UserController';
import { TaskController } from './app/controllers/TaskController';
import { connect } from './app/database';
import { ensureAuthenticated } from './app/middlewares/ensureAuthenticated';

class Server {
  private app: express.Application;

  private userController: UserController;

  private authController: AuthenticateUserController;

  private taskController: TaskController;

  private PORT: string;

  constructor() {
    this.app = express();
    this.app.use(express.json());
  }

  public async configuration() {
    this.PORT = process.env.PORT || '4000';
    await connect();
    this.routes();
  }

  public async routes() {
    this.app.get('/', (req: Request, res:Response) => {
      res.send({ message: 'Hello from API!' });
    });
    this.userController = new UserController();
    this.authController = new AuthenticateUserController();
    this.taskController = new TaskController();
    this.app.post('/auth', this.authController.handle);
    this.app.use('/users', this.userController.router);
    this.app.use('/tasks', ensureAuthenticated, this.taskController.router);
    console.log('🔛 Loaded routes');
  }

  public async start() {
    await this.configuration();
    this.app.listen(this.PORT, () => {
      console.log(`🚀 server is running on port ${this.PORT}`);
    });
  }
}

const server = new Server();
server.start();
