import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly UserRepository: UserRepository) {}
  // async postTrackData(
  //   param: ApiMnt001RequestParam,
  //   body: ApiMnt001RequestBody,
  // ): Promise<ApiMnt001Response> {
  //   console.log(JSON.stringify({ param, body }));
  //   const res = await this.UserRepository.insertTrackData(
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
  //   const res = await this.UserRepository.selectTrack({}, {}, [
  //     { createdAt: 'DESC' },
  //   ]);
  //   return { trackData: res };
  // }
}
