import { Injectable } from '@nestjs/common';
import { DormitoryRepository } from './dormitory.repository';

@Injectable()
export class DormitoryPublicService {
  constructor(private readonly DormitoryRepository: DormitoryRepository) {}
  async getDormitoryInfo(dormitoryId: number) {
    const res = await this.DormitoryRepository.selectDormitory({
      id: dormitoryId,
    });
    if (res.length !== 1) {
      throw new Error('Invalid dormitoryId');
    }
    return res[0];
  }
}
