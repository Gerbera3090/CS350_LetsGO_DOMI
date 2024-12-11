import { Injectable } from '@nestjs/common';
import { DormitoryRepository } from './dormitory.repository';

@Injectable()
export class DormitoryService {
  constructor(private readonly DormitoryRepository: DormitoryRepository) {}
  // async postTrackData(
  //   param: ApiMnt001RequestParam,
  //   body: ApiMnt001RequestBody,
  // ): Promise<ApiMnt001Response> {
  //   console.log(JSON.stringify({ param, body }));
  //   const res = await this.DormitoryRepository.insertTrackData(
  //     param.lmId,
  //     body.trackerId,
  //     body.intensity,
  //   );
  //   if (isNaN(res)) {
  //     throw new Error('Failed to insert');
  //   }
  //   return { trackId: res };
  // }

  // async getTracks(): Promise<ApiMnt002Response> {
  //   const res = await this.DormitoryRepository.selectTrack({}, {}, [
  //     { createdAt: 'DESC' },
  //   ]);
  //   return { trackData: res };
  // }
}
