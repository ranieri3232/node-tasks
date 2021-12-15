import express, { Request, Response } from 'express';
import 'dotenv/config';
import { connect } from './app/database';
import { UserController } from './app/controllers/UserController';

class Server {
  private app: express.Application;

  private userController: UserController;

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
    this.app.use('/users', this.userController.router);
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
