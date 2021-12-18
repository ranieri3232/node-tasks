import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from '../database/entities/UserEntity';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  findByEmailOrUsername(email: string | undefined, username: string | undefined) {
    if (username && email) {
      return this.findOne({ where: [{ email }, { username }] });
    } if (username) {
      return this.findOne({ where: { username } });
    }
    return this.findOne({ where: { email } });
  }
}
