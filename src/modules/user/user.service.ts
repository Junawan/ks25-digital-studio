import { userRepository } from "./user.repository";

import type { User } from "./user.types";

export class UserService {
  async create(user: User) {
    return userRepository.create(user);
  }
}

export const userService = new UserService();