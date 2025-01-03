import { Injectable } from '@nestjs/common';
import { MonitorRepository } from './monitor.repository';
import { ReserveAlarmT, UsageAlarmT, TrackT } from '@schema';

@Injectable()
export class MonitorPublicService {
  constructor(private readonly monitorRepository: MonitorRepository) {}
  checkUsing(intensity: number): boolean {
    const BORDER_LINE = 1015;
    return intensity < BORDER_LINE;
  }

  async getNewestTrackByLMId(lmId: number): Promise<TrackT | null> {
    const res = await this.monitorRepository.selectTrack({ lmId }, {}, [
      { createdAt: 'DESC' },
    ]);

    return res.length > 0 ? res[0] : null;
  }

  async getUsageAlarmByUserIdAndLMId(
    userId: number,
    lmId: number,
  ): Promise<UsageAlarmT | null> {
    const res = await this.monitorRepository.selectUsageAlarm(
      { userId, lmId, alarmed: false },
      {},
      [{ createdAt: 'DESC' }],
    );
    console.log(JSON.stringify({ res, lmId, alarmed: false }));
    return res.length > 0 ? res[0] : null;
  }

  async getReserveAlarmByUserIdAndLMId(
    userId: number,
    lmId: number,
  ): Promise<ReserveAlarmT | null> {
    const res = await this.monitorRepository.selectReserveAlarm(
      { userId, lmId, alarmed: false },
      {},
      [{ createdAt: 'DESC' }],
    );

    return res.length > 0 ? res[0] : null;
  }
}
