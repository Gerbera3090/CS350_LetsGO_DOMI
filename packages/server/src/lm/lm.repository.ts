import { Inject, Injectable } from '@nestjs/common';
import { eq, isNotNull, isNull, and, asc, desc, sql, or } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { DBAsyncProvider } from 'src/db/db.provider';
import {
  LM,
  Track,
  LMT,
  Report,
  LaundryRoom,
  UsageAlarm,
  FLM,
  FLMT,
  ReportT,
} from 'src/db/schema';
import * as schema from 'src/db/schema';

@Injectable()
export class LMRepository {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
  ) {}
  // async selectLMsWithStatus(userId: number, dormitoryFloorId: number) {
  //   type LMStatus = {
  //     id: number;
  //     code: string;
  //     lmTypeEnum: number;
  //     trackId: number;
  //     intensity: number;
  //     last: number;
  //     trackCreatedAt: Date | null;
  //     reportId: number | null;
  //     reportStatusEnumId: number | null;
  //     reportCreatedAt: Date | null;
  //     usageAlarmId: number | null;
  //     usageAlarmAlarmed: boolean;
  //     usageAlarmCreatedAt: Date | null;
  //     flmId: number | null;
  //   };

  //   const res = await this.db
  //     .select({
  //       id: LM.id,
  //       code: LM.code,
  //       lmTypeEnum: LM.lmTypeEnumId,
  //       trackId: sql`COALESCE(MAX(${Track.id}), 0)`.as('trackId'),
  //       intensity: sql`COALESCE(MAX(${Track.intensity}), 1023)`.as('intensity'),
  //       last: sql`COALESCE(MAX(${Track.last}), 0)`.as('last'),
  //       trackCreatedAt: sql`COALESCE(MAX(${Track.createdAt}), NULL)`.as(
  //         'trackCreatedAt',
  //       ),
  //       reportId: sql`COALESCE(MAX(${Report.id}), NULL)`.as('reportId'),
  //       reportStatusEnumId:
  //         sql`COALESCE(MAX(${Report.reportStatusEnumId}), NULL)`.as(
  //           'reportStatusEnumId',
  //         ),
  //       reportCreatedAt: sql`COALESCE(MAX(${Report.createdAt}), NULL)`.as(
  //         'reportCreatedAt',
  //       ),
  //       usageAlarmId: sql`COALESCE(MAX(${UsageAlarm.id}), NULL)`.as(
  //         'usageAlarmId',
  //       ),
  //       usageAlarmAlarmed: sql`COALESCE(MAX(${UsageAlarm.alarmed}), FALSE)`.as(
  //         'usageAlarmAlarmed',
  //       ),
  //       usageAlarmCreatedAt:
  //         sql`COALESCE(MAX(${UsageAlarm.createdAt}), NULL)`.as(
  //           'usageAlarmCreatedAt',
  //         ),
  //       flmId: sql`COALESCE(MAX(${FLM.id}), NULL)`.as('flmId'),
  //     })
  //     .from(LM)
  //     .innerJoin(LaundryRoom, eq(LM.laundryRoomId, LaundryRoom.id))
  //     .leftJoin(Track, eq(LM.id, Track.lmId))
  //     .leftJoin(Report, eq(LM.id, Report.lmId))
  //     .leftJoin(
  //       UsageAlarm,
  //       and(eq(LM.id, UsageAlarm.lmId), eq(UsageAlarm.userId, userId)),
  //     )
  //     .leftJoin(FLM, eq(LM.id, FLM.lmId))
  //     .where(eq(LaundryRoom.dormitoryFloorId, dormitoryFloorId))
  //     .groupBy(LM.id, LM.code, LM.lmTypeEnumId)
  //     .execute();

  //   return res as LMStatus[];
  // }

  async selectLMsByDormitoryFloorId(
    dormitoryFloorId: number,
  ): Promise<(LMT & { isFLM: boolean })[]> {
    const res = await this.db
      .select()
      .from(LM)
      .innerJoin(LaundryRoom, eq(LM.laundryRoomId, LaundryRoom.id))
      .leftJoin(FLM, eq(LM.id, FLM.lmId))
      .where(eq(LaundryRoom.dormitoryFloorId, dormitoryFloorId))
      .execute();

    return res.map((row) => ({
      ...row.lm,
      isFLM: row.flm ? true : false,
    }));
  }

  async selectLMsThatFLMByUserId(
    userId: number,
  ): Promise<(LMT & { priority: number; floor: number })[]> {
    const res = await this.db
      .select({
        id: LM.id,
        code: LM.code,
        laundryRoomId: LM.laundryRoomId,
        lmTypeEnumId: LM.lmTypeEnumId,
        priority: FLM.priority,
        floor: schema.DormitoryFloor.floor,
      })
      .from(LM)
      .innerJoin(FLM, eq(LM.id, FLM.lmId))
      .innerJoin(LaundryRoom, eq(LM.laundryRoomId, LaundryRoom.id))
      .innerJoin(
        schema.DormitoryFloor,
        eq(LaundryRoom.dormitoryFloorId, schema.DormitoryFloor.id),
      )
      .where(eq(FLM.userId, userId))
      .orderBy(asc(FLM.priority))
      .execute();

    return res;
  }

  async selectLM(
    target: Partial<LMT>,
    isNullCondition?: Partial<Record<keyof LMT, boolean>>,
    orderByCondition?: Partial<Record<keyof LMT, 'ASC' | 'DESC'>>[],
  ): Promise<LMT[]> {
    const { id, laundryRoomId, lmTypeEnumId, code } = target;
    let query = this.db.select().from(LM).$dynamic();

    const whereConditions: any[] = [];
    if (id) {
      whereConditions.push(eq(LM.id, id));
    }
    if (laundryRoomId) {
      whereConditions.push(eq(LM.laundryRoomId, laundryRoomId));
    }
    if (lmTypeEnumId) {
      whereConditions.push(eq(LM.lmTypeEnumId, lmTypeEnumId));
    }

    if (isNullCondition) {
      Object.entries(isNullCondition).forEach(([key, value]) => {
        whereConditions.push(
          value
            ? isNull(LM[key as keyof LMT])
            : isNotNull(LM[key as keyof LMT]),
        );
      });
    }

    // 조건이 하나라도 있으면 AND로 묶어서 처리
    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions));
    }
    if (orderByCondition !== undefined) {
      const orderByConditions = orderByCondition.map((order) => {
        const [key, value] = Object.entries(order)[0]; // 각 항목을 키와 값으로 분리
        return value === 'ASC'
          ? asc(LM[key as keyof LMT])
          : desc(LM[key as keyof LMT]);
      });
      if (orderByConditions.length > 0) {
        query = query.orderBy(...orderByConditions);
      }
    }

    // 쿼리 실행
    const res = await query.execute();
    return res;
  }

  async selectFLM(
    target: Partial<FLMT>,
    isNullCondition?: Partial<Record<keyof FLMT, boolean>>,
    orderByCondition?: Partial<Record<keyof FLMT, 'ASC' | 'DESC'>>[],
  ): Promise<FLMT[]> {
    const { id, lmId, userId } = target;
    let query = this.db.select().from(FLM).$dynamic();

    const whereConditions: any[] = [];
    if (id) {
      whereConditions.push(eq(FLM.id, id));
    }
    if (lmId) {
      whereConditions.push(eq(FLM.lmId, lmId));
    }
    if (userId) {
      whereConditions.push(eq(FLM.userId, userId));
    }

    if (isNullCondition) {
      Object.entries(isNullCondition).forEach(([key, value]) => {
        whereConditions.push(
          value
            ? isNull(FLM[key as keyof FLMT])
            : isNotNull(FLM[key as keyof FLMT]),
        );
      });
    }

    // 조건이 하나라도 있으면 AND로 묶어서 처리
    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions));
    }
    if (orderByCondition !== undefined) {
      const orderByConditions = orderByCondition.map((order) => {
        const [key, value] = Object.entries(order)[0]; // 각 항목을 키와 값으로 분리
        return value === 'ASC'
          ? asc(FLM[key as keyof FLMT])
          : desc(FLM[key as keyof FLMT]);
      });
      if (orderByConditions.length > 0) {
        query = query.orderBy(...orderByConditions);
      }
    }

    // 쿼리 실행
    const res = await query.execute();
    return res;
  }

  async insertFLM(
    lmId: number,
    userId: number,
    priority: number,
  ): Promise<number> {
    const res = await this.db.insert(FLM).values({
      lmId,
      userId,
      priority,
    });
    return res[0].insertId;
  }

  async deleteFLM(lmId: number, userId: number): Promise<boolean> {
    const res = await this.db
      .delete(FLM)
      .where(and(eq(FLM.lmId, lmId), eq(FLM.userId, userId)))
      .execute();
    return true;
  }

  async selectReport(
    target: Partial<ReportT>,
    isNullCondition?: Partial<Record<keyof ReportT, boolean>>,
    orderByCondition?: Partial<Record<keyof ReportT, 'ASC' | 'DESC'>>[],
  ): Promise<ReportT[]> {
    const { id, lmId, reportStatusEnumId } = target;
    let query = this.db.select().from(Report).$dynamic();

    const whereConditions: any[] = [];
    if (id) {
      whereConditions.push(eq(Report.id, id));
    }
    if (lmId) {
      whereConditions.push(eq(Report.lmId, lmId));
    }
    if (reportStatusEnumId) {
      whereConditions.push(eq(Report.reportStatusEnumId, reportStatusEnumId));
    }

    if (isNullCondition) {
      Object.entries(isNullCondition).forEach(([key, value]) => {
        whereConditions.push(
          value
            ? isNull(Report[key as keyof Report])
            : isNotNull(Report[key as keyof Report]),
        );
      });
    }

    // 조건이 하나라도 있으면 AND로 묶어서 처리
    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions));
    }
    if (orderByCondition !== undefined) {
      const orderByConditions = orderByCondition.map((order) => {
        const [key, value] = Object.entries(order)[0]; // 각 항목을 키와 값으로 분리
        return value === 'ASC'
          ? asc(Report[key as keyof ReportT])
          : desc(Report[key as keyof ReportT]);
      });
      if (orderByConditions.length > 0) {
        query = query.orderBy(...orderByConditions);
      }
    }

    // 쿼리 실행
    const res = await query.execute();
    return res;
  }

  async selectFLMWithLMAndFloor(userId: number): Promise<
    {
      id: number;
      lmId: number;
      priority: number;
      userId: number;
      code: string;
      floor: number;
      lmTypeEnum: number;
    }[]
  > {
    const res = await this.db
      .select({
        id: FLM.id,
        lmId: FLM.lmId,
        userId: FLM.userId,
        priority: FLM.priority,
        code: LM.code,
        floor: schema.DormitoryFloor.floor,
        lmTypeEnum: LM.lmTypeEnumId,
      })
      .from(FLM)
      .innerJoin(LM, eq(FLM.lmId, LM.id))
      .innerJoin(LaundryRoom, eq(LM.laundryRoomId, LaundryRoom.id))
      .innerJoin(
        schema.DormitoryFloor,
        eq(LaundryRoom.dormitoryFloorId, schema.DormitoryFloor.id),
      )
      .where(eq(FLM.userId, userId))
      .orderBy(asc(FLM.priority))
      .execute();
    return res;
  }

  // async insertFLMData(
  //   lmId: number,
  //   trackerId: number,
  //   intensity: number,
  // ): Promise<number> {
  //   const res = await this.db.insert(Track).values({
  //     lmId,
  //     trackerId,
  //     intensity,
  //   });
  //   console.log(JSON.stringify({ lmId, trackerId, intensity }));
  //   console.log(JSON.stringify(res[0].insertId));
  //   return res[0].insertId;
  // }

  // async selectTrack(
  //   target: Partial<TrackT>,
  //   isNullCondition?: Partial<Record<keyof TrackT, boolean>>,
  //   orderByCondition?: Partial<Record<keyof TrackT, 'ASC' | 'DESC'>>[],
  // ): Promise<TrackT[]> {
  //   const { id, lmId, trackerId, intensity } = target;
  //   let query = this.db.select().from(Track).$dynamic();

  //   const whereConditions: any[] = [];
  //   if (id) {
  //     whereConditions.push(eq(Track.id, id));
  //   }
  //   if (lmId) {
  //     whereConditions.push(eq(Track.lmId, lmId));
  //   }
  //   if (trackerId) {
  //     whereConditions.push(eq(Track.trackerId, trackerId));
  //   }
  //   if (intensity) {
  //     whereConditions.push(eq(Track.intensity, intensity));
  //   }

  //   if (isNullCondition) {
  //     Object.entries(isNullCondition).forEach(([key, value]) => {
  //       whereConditions.push(
  //         value
  //           ? isNull(Track[key as keyof TrackT])
  //           : isNotNull(Track[key as keyof TrackT]),
  //       );
  //     });
  //   }

  //   // 조건이 하나라도 있으면 AND로 묶어서 처리
  //   if (whereConditions.length > 0) {
  //     query = query.where(and(...whereConditions));
  //   }
  //   if (orderByCondition !== undefined) {
  //     const orderByConditions = orderByCondition.map((order) => {
  //       const [key, value] = Object.entries(order)[0]; // 각 항목을 키와 값으로 분리
  //       return value === 'ASC'
  //         ? asc(Track[key as keyof TrackT])
  //         : desc(Track[key as keyof TrackT]);
  //     });
  //     if (orderByConditions.length > 0) {
  //       query = query.orderBy(...orderByConditions);
  //     }
  //   }

  //   // 쿼리 실행
  //   const res = await query.execute();
  //   return res;
  // }
}
