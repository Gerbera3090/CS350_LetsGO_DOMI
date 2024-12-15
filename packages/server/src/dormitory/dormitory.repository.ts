import { Inject, Injectable } from '@nestjs/common';
import { eq, isNotNull, isNull, and, asc, desc } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { DBAsyncProvider } from '../db/db.provider';
import * as schema from '@schema';
import {
  Dormitory,
  DormitoryT,
  DormitoryFloor,
  DormitoryFloorT,
} from '@schema';

@Injectable()
export class DormitoryRepository {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
  ) {}

  async selectDormitory(
    target: Partial<DormitoryT>,
    isNullCondition?: Partial<Record<keyof DormitoryT, boolean>>,
    orderByCondition?: Partial<Record<keyof DormitoryT, 'ASC' | 'DESC'>>[],
  ): Promise<DormitoryT[]> {
    const { id, name, gender, code } = target;
    let query = this.db.select().from(Dormitory).$dynamic();

    const whereConditions: any[] = [];
    if (id) {
      whereConditions.push(eq(Dormitory.id, id));
    }
    if (name) {
      whereConditions.push(eq(Dormitory.name, name));
    }
    if (gender) {
      whereConditions.push(eq(Dormitory.gender, gender));
    }
    if (gender) {
      whereConditions.push(eq(Dormitory.gender, gender));
    }
    if (code) {
      whereConditions.push(eq(Dormitory.code, code));
    }
    if (isNullCondition) {
      Object.entries(isNullCondition).forEach(([key, value]) => {
        whereConditions.push(
          value
            ? isNull(Dormitory[key as keyof DormitoryT])
            : isNotNull(Dormitory[key as keyof DormitoryT]),
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
          ? asc(Dormitory[key as keyof DormitoryT])
          : desc(Dormitory[key as keyof DormitoryT]);
      });
      if (orderByConditions.length > 0) {
        query = query.orderBy(...orderByConditions);
      }
    }

    // 쿼리 실행
    const res = await query.execute();
    return res;
  }

  async selectFloor(
    target: Partial<DormitoryFloorT>,
    isNullCondition?: Partial<Record<keyof DormitoryFloorT, boolean>>,
    orderByCondition?: Partial<Record<keyof DormitoryFloorT, 'ASC' | 'DESC'>>[],
  ): Promise<DormitoryFloorT[]> {
    const { id, dormitoryId, floor } = target;
    let query = this.db.select().from(DormitoryFloor).$dynamic();

    const whereConditions: any[] = [];
    if (id) {
      whereConditions.push(eq(DormitoryFloor.id, id));
    }
    if (dormitoryId) {
      whereConditions.push(eq(DormitoryFloor.dormitoryId, dormitoryId));
    }
    if (floor) {
      whereConditions.push(eq(DormitoryFloor.floor, floor));
    }
    if (isNullCondition) {
      Object.entries(isNullCondition).forEach(([key, value]) => {
        whereConditions.push(
          value
            ? isNull(DormitoryFloor[key as keyof DormitoryFloorT])
            : isNotNull(DormitoryFloor[key as keyof DormitoryFloorT]),
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
          ? asc(DormitoryFloor[key as keyof DormitoryFloorT])
          : desc(DormitoryFloor[key as keyof DormitoryFloorT]);
      });
      if (orderByConditions.length > 0) {
        query = query.orderBy(...orderByConditions);
      }
    }

    // 쿼리 실행
    const res = await query.execute();
    return res;
  }

  // async insertDormitoryData(
  //   lmId: number,
  //   trackerId: number,
  //   intensity: number,
  // ): Promise<number> {
  //   const res = await this.db.insert(Dormitory).values({
  //     lmId,
  //     trackerId,
  //     intensity,
  //   });
  //   console.log(JSON.stringify({ lmId, trackerId, intensity }));
  //   console.log(JSON.stringify(res[0].insertId));
  //   return res[0].insertId;
  // }
}
