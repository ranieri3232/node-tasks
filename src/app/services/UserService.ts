import { getCustomRepository } from 'typeorm';
import bcrypt from 'bcrypt';
import { UserRequest } from '../controllers/UserController';
import { UserRepository } from '../repository/UserRepository';

export type UserUpdateRequest = {
  id: string;
  username: string | undefined;
  email: string | undefined;
  name: string | undefined;
}
/* eslint-disable arrow-body-style */
export class UserService {
  private UserRepository: UserRepository;

  constructor() {
    this.UserRepository = getCustomRepository(UserRepository);
  }

  public index = async (id: string) => {
    const user = await this.UserRepository.findOne(id);
    if (!user) {
      throw new Error('Invalid user ID.');
    }
    delete user.password;
    return user;
  };

  public create = async (user: UserRequest) => {
    const findUser = await this.UserRepository.findByEmailOrUsername(user.email, user.username);
    if (findUser) {
      if (findUser.username === user.username) {
        throw new Error('username is already in use');
      } else {
        throw new Error('email is already in use');
      }
    }
    const userEntity = this.UserRepository.create(user);
    const newUser = await this.UserRepository.save(userEntity);
    delete newUser.password;
    return newUser;
  };

  public update = async ({
    id, name, email, username,
  }:UserUpdateRequest) => {
    console.log(id, email, name, username);
    const user = await this.UserRepository.findOne(id);
    if (!user) {
      throw new Error('User does not exists');
    }
    user.name = name ?? user.name;
    const result = await this.UserRepository.findByEmailOrUsername(email, username);
    if (result) {
      if (result.email === email && result.username === username) {
        throw new Error('The email and username are already in use.');
      } else if (result.username === username) {
        throw new Error('The username is already in use.');
      } else {
        throw new Error('The email is already in use.');
      }
    }
    user.email = email ?? user.email;
    user.username = username ?? user.username;
    await this.UserRepository.save(user);
    delete user.password;
    return user;
  };

  public delete = async (id: string, password: string) => {
    console.log(id, password);
    const user = await this.UserRepository.findOne(id);
    if (!user) {
      throw new Error('User doesnt exists');
    } try {
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new Error('Password doesnt match.');
      }
      await this.UserRepository.delete(id);
      return { message: `User ${id} successfully deleted` };
    } catch {
      throw new Error('Password doesnt match.');
    }
  };
}
