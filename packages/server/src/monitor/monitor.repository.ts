import { Inject, Injectable } from '@nestjs/common';
import { eq, isNotNull, isNull, and, asc, desc } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { DBAsyncProvider } from 'src/db/db.provider';
import * as schema from 'src/db/schema';

@Injectable()
export class MonitorRepository {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
  ) {}

  async insertTrackData(
    lmId: number,
    trackerId: number,
    intensity: number,
    last: number,
  ): Promise<number> {
    const res = await this.db.insert(schema.Track).values({
      lmId,
      trackerId,
      intensity,
      last,
    });
    console.log(JSON.stringify({ lmId, trackerId, intensity }));
    console.log(JSON.stringify(res[0].insertId));
    return res[0].insertId;
  }

  async selectTrack(
    target: Partial<schema.TrackT>,
    isNullCondition?: Partial<Record<keyof schema.TrackT, boolean>>,
    orderByCondition?: Partial<Record<keyof schema.TrackT, 'ASC' | 'DESC'>>[],
  ): Promise<schema.TrackT[]> {
    const { id, lmId, trackerId, intensity } = target;
    let query = this.db.select().from(schema.Track).$dynamic();

    const whereConditions: any[] = [];
    if (id) {
      whereConditions.push(eq(schema.Track.id, id));
    }
    if (lmId) {
      whereConditions.push(eq(schema.Track.lmId, lmId));
    }
    if (trackerId) {
      whereConditions.push(eq(schema.Track.trackerId, trackerId));
    }
    if (intensity) {
      whereConditions.push(eq(schema.Track.intensity, intensity));
    }

    if (isNullCondition) {
      Object.entries(isNullCondition).forEach(([key, value]) => {
        whereConditions.push(
          value
            ? isNull(schema.Track[key as keyof schema.TrackT])
            : isNotNull(schema.Track[key as keyof schema.TrackT]),
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
          ? asc(schema.Track[key as keyof schema.TrackT])
          : desc(schema.Track[key as keyof schema.TrackT]);
      });
      if (orderByConditions.length > 0) {
        query = query.orderBy(...orderByConditions);
      }
    }

    // 쿼리 실행
    const res = await query.execute();
    return res;
  }

  async selectUsageAlarm(
    target: Partial<schema.UsageAlarmT>,
    isNullCondition?: Partial<Record<keyof schema.UsageAlarmT, boolean>>,
    orderByCondition?: Partial<
      Record<keyof schema.UsageAlarmT, 'ASC' | 'DESC'>
    >[],
  ): Promise<schema.UsageAlarmT[]> {
    const { id, lmId, userId, alarmed } = target;
    let query = this.db.select().from(schema.UsageAlarm).$dynamic();

    const whereConditions: any[] = [];
    if (id) {
      whereConditions.push(eq(schema.UsageAlarm.id, id));
    }
    if (lmId) {
      whereConditions.push(eq(schema.UsageAlarm.lmId, lmId));
    }
    if (userId) {
      whereConditions.push(eq(schema.UsageAlarm.userId, userId));
    }
    if (alarmed) {
      whereConditions.push(eq(schema.UsageAlarm.alarmed, alarmed));
    }

    if (isNullCondition) {
      Object.entries(isNullCondition).forEach(([key, value]) => {
        whereConditions.push(
          value
            ? isNull(schema.UsageAlarm[key as keyof schema.UsageAlarmT])
            : isNotNull(schema.UsageAlarm[key as keyof schema.UsageAlarmT]),
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
          ? asc(schema.UsageAlarm[key as keyof schema.UsageAlarmT])
          : desc(schema.UsageAlarm[key as keyof schema.UsageAlarmT]);
      });
      if (orderByConditions.length > 0) {
        query = query.orderBy(...orderByConditions);
      }
    }

    // 쿼리 실행
    const res = await query.execute();
    return res;
  }

  async insertUsageAlarm(lmId: number, userId: number): Promise<number> {
    const res = await this.db.insert(schema.UsageAlarm).values({
      lmId,
      userId,
      alarmed: false,
    });
    console.log(JSON.stringify({ lmId, userId, alarmed: false }));
    console.log(JSON.stringify(res[0].insertId));
    return res[0].insertId;
  }

  async deleteUsageAlarm(lmId: number, userId: number): Promise<boolean> {
    const res = await this.db
      .delete(schema.UsageAlarm)
      .where(
        and(
          eq(schema.UsageAlarm.lmId, lmId),
          eq(schema.UsageAlarm.userId, userId),
        ),
      )
      .execute();
    return true;
  }

  async updateUsageAlarm(
    target: Partial<schema.UsageAlarmT>, // 수정할 필드를 담은 객체
    condition: Partial<schema.UsageAlarmT>, // 조건
  ): Promise<boolean> {
    const { id, userId, lmId, alarmed } = condition;

    let query = this.db.update(schema.UsageAlarm).set(target).$dynamic();

    // 조건 설정
    const whereConditions: any[] = [];

    if (id) {
      whereConditions.push(eq(schema.UsageAlarm.id, id));
    }
    if (userId) {
      whereConditions.push(eq(schema.UsageAlarm.userId, userId));
    }
    if (lmId) {
      whereConditions.push(eq(schema.UsageAlarm.lmId, lmId));
    }
    if (alarmed) {
      whereConditions.push(eq(schema.UsageAlarm.alarmed, alarmed));
    }

    // 조건이 하나라도 있으면 AND로 묶어서 처리
    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions));
    }

    // 쿼리 실행
    await query.execute();

    // 업데이트가 완료되었으므로 true 반환
    return true;
  }

  async selectReserveAlarm(
    target: Partial<schema.ReserveAlarmT>,
    isNullCondition?: Partial<Record<keyof schema.ReserveAlarmT, boolean>>,
    orderByCondition?: Partial<
      Record<keyof schema.ReserveAlarmT, 'ASC' | 'DESC'>
    >[],
  ): Promise<schema.ReserveAlarmT[]> {
    const { id, lmId, userId, alarmed } = target;
    let query = this.db.select().from(schema.ReserveAlarm).$dynamic();

    const whereConditions: any[] = [];
    if (id) {
      whereConditions.push(eq(schema.ReserveAlarm.id, id));
    }
    if (lmId) {
      whereConditions.push(eq(schema.ReserveAlarm.lmId, lmId));
    }
    if (userId) {
      whereConditions.push(eq(schema.ReserveAlarm.userId, userId));
    }
    if (alarmed) {
      whereConditions.push(eq(schema.ReserveAlarm.alarmed, alarmed));
    }

    if (isNullCondition) {
      Object.entries(isNullCondition).forEach(([key, value]) => {
        whereConditions.push(
          value
            ? isNull(schema.ReserveAlarm[key as keyof schema.ReserveAlarmT])
            : isNotNull(schema.ReserveAlarm[key as keyof schema.ReserveAlarmT]),
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
          ? asc(schema.ReserveAlarm[key as keyof schema.ReserveAlarmT])
          : desc(schema.ReserveAlarm[key as keyof schema.ReserveAlarmT]);
      });
      if (orderByConditions.length > 0) {
        query = query.orderBy(...orderByConditions);
      }
    }

    // 쿼리 실행
    const res = await query.execute();
    return res;
  }

  async insertReserveAlarm(lmId: number, userId: number): Promise<number> {
    const res = await this.db.insert(schema.ReserveAlarm).values({
      lmId,
      userId,
      alarmed: false,
    });
    console.log(JSON.stringify({ lmId, userId, alarmed: false }));
    console.log(JSON.stringify(res[0].insertId));
    return res[0].insertId;
  }

  async deleteReserveAlarm(lmId: number, userId: number): Promise<boolean> {
    const res = await this.db
      .delete(schema.ReserveAlarm)
      .where(
        and(
          eq(schema.ReserveAlarm.lmId, lmId),
          eq(schema.ReserveAlarm.userId, userId),
        ),
      )
      .execute();
    return true;
  }

  async updateReserveAlarm(
    target: Partial<schema.ReserveAlarmT>, // 수정할 필드를 담은 객체
    condition: Partial<schema.ReserveAlarmT>, // 조건
  ): Promise<boolean> {
    const { id, userId, lmId, alarmed } = condition;

    let query = this.db.update(schema.ReserveAlarm).set(target).$dynamic();

    // 조건 설정
    const whereConditions: any[] = [];

    if (id) {
      whereConditions.push(eq(schema.ReserveAlarm.id, id));
    }
    if (userId) {
      whereConditions.push(eq(schema.ReserveAlarm.userId, userId));
    }
    if (lmId) {
      whereConditions.push(eq(schema.ReserveAlarm.lmId, lmId));
    }
    if (alarmed) {
      whereConditions.push(eq(schema.ReserveAlarm.alarmed, alarmed));
    }

    // 조건이 하나라도 있으면 AND로 묶어서 처리
    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions));
    }

    // 쿼리 실행
    await query.execute();

    // 업데이트가 완료되었으므로 true 반환
    return true;
  }
}
