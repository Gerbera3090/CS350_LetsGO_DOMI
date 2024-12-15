import { Injectable } from '@nestjs/common';
import { DormitoryRepository } from './dormitory.repository';
import { ApiDor001Response } from '@depot/api/dormitory';

@Injectable()
export class DormitoryService {
  constructor(private readonly DormitoryRepository: DormitoryRepository) {}

  async getFloors(dormitoryId: number): Promise<ApiDor001Response> {
    const res = await this.DormitoryRepository.selectFloor({ dormitoryId });
    return {
      floors: res.map((floor) => {
        return {
          id: floor.id,
          floor: floor.floor,
        };
      }),
    };
  }
}
