import { Injectable } from '@nestjs/common';
import { MonitorRepository } from './monitor.repository';
import {
  ApiMnt001RequestBody,
  ApiMnt001RequestParam,
  ApiMnt001Response,
  ApiMnt002Response,
} from '@depot/api/monitor';
import { MonitorPublicService } from './monitor.public.service';

@Injectable()
export class MonitorService {
  constructor(
    private readonly MonitorRepository: MonitorRepository,
    private readonly monitorPublicService: MonitorPublicService,
  ) {}
  async postTrackData(
    param: ApiMnt001RequestParam,
    body: ApiMnt001RequestBody,
  ): Promise<ApiMnt001Response> {
    console.log(JSON.stringify({ param, body }));
    const prevTrack = await this.MonitorRepository.selectTrack(
      { trackerId: body.trackerId },
      {},
      [{ createdAt: 'DESC' }],
    );
    let diff = 0;
    let last = 0;
    if (prevTrack.length > 0) {
      const prev = prevTrack[0];
      const now = new Date();
      if (
        (await this.monitorPublicService.checkUsing(prev.intensity)) &&
        (await this.monitorPublicService.checkUsing(body.intensity))
      ) {
        diff = now.getTime() - prev.createdAt.getTime();
        last = prev.last + Math.ceil(diff / 1000);
      }
    }

    const res = await this.MonitorRepository.insertTrackData(
      param.lmId,
      body.trackerId,
      body.intensity,
      last,
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

  async postUsageAlarm(lmId: number, userId: number): Promise<number> {
    const checkAlreadyUsageAlarm =
      await this.MonitorRepository.selectUsageAlarm({
        lmId,
        userId,
      });
    if (checkAlreadyUsageAlarm.length > 0) {
      throw new Error('Already UsageAlarm');
    }
    const res = await this.MonitorRepository.insertUsageAlarm(lmId, userId);
    return res;
  }

  async deleteUsageAlarm(lmId: number, userId: number): Promise<number> {
    const checkAlreadyUsageAlarm =
      await this.MonitorRepository.selectUsageAlarm({
        lmId,
        userId,
      });
    if (checkAlreadyUsageAlarm.length === 0) {
      throw new Error('There is No UsageAlarm');
    }
    const res = await this.MonitorRepository.deleteUsageAlarm(lmId, userId);
    return checkAlreadyUsageAlarm[0].id;
  }

  async postReserveAlarm(lmId: number, userId: number): Promise<number> {
    const checkAlreadyReserveAlarm =
      await this.MonitorRepository.selectReserveAlarm({
        lmId,
        userId,
      });
    if (checkAlreadyReserveAlarm.length > 0) {
      throw new Error('Already ReserveAlarm');
    }
    const res = await this.MonitorRepository.insertReserveAlarm(lmId, userId);
    return res;
  }

  async deleteReserveAlarm(lmId: number, userId: number): Promise<number> {
    const checkAlreadyReserveAlarm =
      await this.MonitorRepository.selectReserveAlarm({
        lmId,
        userId,
      });
    if (checkAlreadyReserveAlarm.length === 0) {
      throw new Error('There is No ReserveAlarm');
    }
    const res = await this.MonitorRepository.deleteReserveAlarm(lmId, userId);
    return checkAlreadyReserveAlarm[0].id;
  }
}
