import { Injectable } from '@nestjs/common';
import { MonitorRepository } from './monitor.repository';
import {
  ApiMnt001RequestBody,
  ApiMnt001RequestParam,
  ApiMnt001Response,
  ApiMnt002Response,
} from '@depot/api/monitor';

@Injectable()
export class MonitorService {
  constructor(private readonly MonitorRepository: MonitorRepository) {}
  async postTrackData(
    param: ApiMnt001RequestParam,
    body: ApiMnt001RequestBody,
  ): Promise<ApiMnt001Response> {
    console.log(JSON.stringify({ param, body }));
    const res = await this.MonitorRepository.insertTrackData(
      param.lmId,
      body.trackerId,
      body.intensity,
    );
    if (isNaN(res)) {
      throw new Error('Failed to insert');
    }
    return { trackId: res };
  }

  async getTracks(): Promise<ApiMnt002Response> {
    const res = await this.MonitorRepository.selectTrack({}, {}, [
      { createdAt: 'DESC' },
    ]);
    return { trackData: res };
  }
}
