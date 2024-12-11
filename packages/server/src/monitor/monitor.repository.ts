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
}
