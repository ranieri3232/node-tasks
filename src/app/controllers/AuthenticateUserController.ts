import { Request, Response } from 'express';
import { AuthenticateUserService } from '../services/AuthenticateUserService';

class AuthenticateUserController {
  public async handle(req: Request, res: Response) {
    const { email, username, password } = req.body;
    const service = new AuthenticateUserService();
    if (!email && !username) {
      return res.status(409).send({ message: 'password and email are empty.' });
    }
    try {
      const result = await service.auth({ email, username, password });
      return res.send(result);
    } catch (err) {
      return res.status(409).send({ message: err.message });
    }
  }
}
export { AuthenticateUserController };
