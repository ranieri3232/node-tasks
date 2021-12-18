import { getCustomRepository } from 'typeorm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repository/UserRepository';

type AuthCredentials = {
	email: string | undefined;
	username: string | undefined;
	password: string;
}
class AuthenticateUserService {
  private UserRepository: UserRepository;

  constructor() {
    this.UserRepository = getCustomRepository(UserRepository);
  }

  public auth = async ({ email, username, password }: AuthCredentials) => {
    const user = await this.UserRepository.findByEmailOrUsername(email, username);
    if (!user) {
      throw new Error('User does not exists!');
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Credentials mismatch');
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    delete user.password;
    return { user, token };
  };
}
export { AuthenticateUserService };
