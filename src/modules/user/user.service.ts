import { userRepository } from "./user.repository";

import type { User } from "./user.types";

export class UserService {
  async create(user: User) {
    return userRepository.create(user);
  }

  async getById(userId: string) {
  return userRepository.getById(userId);
}
}

export const userService = new UserService();