import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserPublicService {
  constructor(private readonly UserRepository: UserRepository) {}
  async getUserInfo(userId: number) {
    const res = await this.UserRepository.selectUser({ id: userId });
    if (res.length !== 1) {
      throw new Error('Invalid userId');
    }
    return res[0];
  }
}
