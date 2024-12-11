import { Injectable } from '@nestjs/common';
import { LMRepository } from './lm.repository';
import { ApiLmc001RequestQuery, ApiLmc001Response } from '@depot/api/lm';
import { UserPublicService } from 'src/user/user.public.service';
import { MonitorPublicService } from 'src/monitor/monitor.public.service';
import { LMStatusE } from '@schema';

@Injectable()
export class LMService {
  constructor(
    private readonly lmRepository: LMRepository,
    private readonly userPublicService: UserPublicService,
    private readonly monitorPublicService: MonitorPublicService,
  ) {}
  async getLMs(query: ApiLmc001RequestQuery): Promise<ApiLmc001Response> {
    console.log(JSON.stringify({ query }));
    const { userId, dormitoryFloorId } = query;

    const res = await this.lmRepository.selectLMsWithStatus(
      userId,
      dormitoryFloorId,
    );

    const lms = await Promise.all(
      res.map(async (lm) => {
        return {
          id: lm.id,
          code: lm.code,
          lmTypeEnum: lm.lmTypeEnum,
          lmStatusEnum:
            lm.intensity &&
            (await this.monitorPublicService.checkUsing(lm.intensity))
              ? lm.usageAlarmAlarmed
                ? LMStatusE.Using
                : LMStatusE.Occupied
              : LMStatusE.Available,
          reportStatusEnum: lm.reportId ? lm.reportId : LMStatusE.Available,
          last: lm.last,
          alarmed: lm.usageAlarmAlarmed ? lm.usageAlarmAlarmed : false,
          isFLM: lm.flmId ? true : false,
        };
      }),
    );

    return { lms: lms };
  }
}
