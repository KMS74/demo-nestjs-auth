import { Injectable } from '@nestjs/common';
import { User } from './user.type';

const users: User[] = [
  {
    userId: 1,
    username: 'john',
    password: 'change me',
  },
  {
    userId: 2,
    username: 'chris',
    password: 'secret',
  },
  {
    userId: 3,
    username: 'maria',
    password: 'guess',
  },
];

@Injectable()
export class UsersService {
  async findUserByName(username: string) {
    return users.find((user) => user.username === username);
  }
}
