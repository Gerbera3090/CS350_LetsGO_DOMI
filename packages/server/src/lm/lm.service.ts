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

    const res =
      await this.lmRepository.selectLMsByDormitoryFloorId(dormitoryFloorId);

    const lms = await Promise.all(
      res.map(async (lm) => {
        const trackNewest =
          await this.monitorPublicService.getNewestTrackByLMId(lm.id);
        const checkUsing = trackNewest
          ? await this.monitorPublicService.checkUsing(trackNewest.intensity)
          : false;
        const usageAlarm =
          await this.monitorPublicService.getUsageAlarmByUserIdAndLMId(
            lm.id,
            userId,
          );
        const reserveAlarm =
          await this.monitorPublicService.getReserveAlarmByUserIdAndLMId(
            lm.id,
            userId,
          );
        const reportStatus = await this.lmRepository.selectReport(
          { lmId: lm.id },
          {},
          [{ createdAt: 'DESC' }],
        );

        return {
          id: lm.id,
          code: lm.code,
          lmTypeEnum: lm.lmTypeEnumId,
          lmStatusEnum: checkUsing // 사용 중
            ? usageAlarm // 내가 사용 중?
              ? LMStatusE.Using
              : LMStatusE.Occupied
            : LMStatusE.Available,
          last: trackNewest && checkUsing ? trackNewest.last : 0,
          alarmed: reserveAlarm ? reserveAlarm.alarmed : false,
          reportStatusEnum:
            reportStatus.length > 0 ? reportStatus[0].reportStatusEnumId : 0,
          isFLM: lm.isFLM,
        };
      }),
    );

    return { lms: lms };
  }
  // async getLMs(query: ApiLmc001RequestQuery): Promise<ApiLmc001Response> {
  //   console.log(JSON.stringify({ query }));
  //   const { userId, dormitoryFloorId } = query;

  //   const res = await this.lmRepository.selectLMsWithStatus(
  //     userId,
  //     dormitoryFloorId,
  //   );

  //   const lms = await Promise.all(
  //     res.map(async (lm) => {
  //       return {
  //         id: lm.id,
  //         code: lm.code,
  //         lmTypeEnum: lm.lmTypeEnum,
  //         lmStatusEnum:
  //           lm.intensity &&
  //           (await this.monitorPublicService.checkUsing(lm.intensity))
  //             ? lm.usageAlarmAlarmed
  //               ? LMStatusE.Using
  //               : LMStatusE.Occupied
  //             : LMStatusE.Available,
  //         reportStatusEnum: lm.reportId ? lm.reportId : LMStatusE.Available,
  //         last: lm.last,
  //         alarmed: lm.usageAlarmAlarmed ? lm.usageAlarmAlarmed : false,
  //         isFLM: lm.flmId ? true : false,
  //       };
  //     }),
  //   );

  //   return { lms: lms };
  // }

  async postFLM(lmId: number, userId: number): Promise<number> {
    const checkAlreadyFLM = await this.lmRepository.selectFLM({ userId, lmId });
    if (checkAlreadyFLM.length > 0) {
      throw new Error('Already FLM');
    }
    const flms = await this.lmRepository.selectFLM({ userId }, {}, [
      { priority: 'DESC' },
    ]);
    let priority = 1;
    if (flms.length > 0) {
      // 가장 낮은 priority로 더해줌
      priority = flms[0].priority + 1;
    }
    const res = await this.lmRepository.insertFLM(lmId, userId, priority);
    return res;
  }

  async deleteFLM(lmId: number, userId: number): Promise<number> {
    const checkAlreadyFLM = await this.lmRepository.selectFLM({ userId, lmId });
    if (checkAlreadyFLM.length === 0) {
      throw new Error('There is No FLM');
    }

    const res = await this.lmRepository.deleteFLM(lmId, userId);

    return checkAlreadyFLM[0].id;
  }
}
