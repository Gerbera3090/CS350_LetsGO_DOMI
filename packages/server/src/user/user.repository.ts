import { Inject, Injectable } from '@nestjs/common';
import { eq, isNotNull, isNull, and, asc, desc } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { DBAsyncProvider } from 'src/db/db.provider';
import * as schema from 'src/db/schema';
import { User, UserT } from 'src/db/schema';

@Injectable()
export class UserRepository {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
  ) {}

  async selectUser(
    target: Partial<UserT>,
    isNullCondition?: Partial<Record<keyof UserT, boolean>>,
    orderByCondition?: Partial<Record<keyof UserT, 'ASC' | 'DESC'>>[],
  ): Promise<UserT[]> {
    const { id, email, password } = target;
    let query = this.db.select().from(User).$dynamic();

    const whereConditions: any[] = [];
    if (id) {
      whereConditions.push(eq(User.id, id));
    }
    if (email) {
      whereConditions.push(eq(User.email, email));
    }
    if (password) {
      whereConditions.push(eq(User.password, password));
    }

    if (isNullCondition) {
      Object.entries(isNullCondition).forEach(([key, value]) => {
        whereConditions.push(
          value
            ? isNull(User[key as keyof UserT])
            : isNotNull(User[key as keyof UserT]),
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
          ? asc(User[key as keyof UserT])
          : desc(User[key as keyof UserT]);
      });
      if (orderByConditions.length > 0) {
        query = query.orderBy(...orderByConditions);
      }
    }

    // 쿼리 실행
    const res = await query.execute();
    return res;
  }

  // async insertUserData(
  //   lmId: number,
  //   trackerId: number,
  //   intensity: number,
  // ): Promise<number> {
  //   const res = await this.db.insert(User).values({
  //     lmId,
  //     trackerId,
  //     intensity,
  //   });
  //   console.log(JSON.stringify({ lmId, trackerId, intensity }));
  //   console.log(JSON.stringify(res[0].insertId));
  //   return res[0].insertId;
  // }
}
