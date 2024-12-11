import { Inject, Injectable } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { DBAsyncProvider } from 'src/db/db.provider';
import * as schema from 'src/db/schema';
import { eq, and, or } from 'drizzle-orm';

@Injectable()
export class AppService {
  constructor(
    @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async initialSetting(): Promise<boolean> {
    // 초기 데이터가 존재하면 false 반환
    const selectRes = await this.db.select().from(schema.LMTypeEnum).execute();
    if (selectRes.length > 0) {
      return false;
    }
    const res = await this.db.transaction(async (trx) => {
      // Enum Data 초기화
      // LMTypeEnum 초기 데이터 삽입
      await trx
        .insert(schema.LMTypeEnum)
        .values([{ name: 'Washer' }, { name: 'Dryer' }]);
      const resLmtype = await trx.select().from(schema.LMTypeEnum).execute();
      console.log(JSON.stringify(resLmtype));

      // UserTypeEnum 초기 데이터 삽입
      await trx
        .insert(schema.UserTypeEnum)
        .values([{ name: 'Resident' }, { name: 'Supervisor' }]);

      // ReportStatusEnum 초기 데이터 삽입
      await trx
        .insert(schema.ReportStatusEnum)
        .values([
          { name: 'Available' },
          { name: 'Broken' },
          { name: 'On Repair' },
        ]);

      // Dormitory 초기 데이터 삽입
      // Step 1: Dormitory 삽입
      const dormitories = [
        {
          name: '미르관',
          nameEng: 'Mir Hall',
          maxFloor: 15,
          gender: 1,
          code: 'MIR',
        },
        {
          name: '신뢰관',
          nameEng: 'Silloe Hall',
          maxFloor: 5,
          gender: 1,
          code: 'SIL',
        },
        {
          name: '아름관',
          nameEng: 'Areum Hall',
          maxFloor: 5,
          gender: 2,
          code: 'ARE',
        },
        {
          name: '나래관',
          nameEng: 'Narae Hall',
          maxFloor: 9,
          gender: 2,
          code: 'NAR',
        },
      ];

      for (const dormitory of dormitories) {
        // Dormitory 삽입
        await trx.insert(schema.Dormitory).values(dormitory);

        // 방금 삽입한 dormitory의 id 가져오기
        const [{ id: dormitoryId }] = await trx
          .select({ id: schema.Dormitory.id })
          .from(schema.Dormitory)
          .where(eq(schema.Dormitory.code, dormitory.code));

        // Step 2: DormitoryFloor 및 LaundryRoom 생성
        for (let floor = 1; floor <= dormitory.maxFloor; floor++) {
          let laundryRoomIndex = 1; // 층별 laundry room 번호 초기화
          // 층 조건: 미르관과 나래관은 홀수 층만
          if (
            (dormitory.code === 'MIR' || dormitory.code === 'NAR') &&
            floor % 2 === 0
          ) {
            continue;
          }

          // DormitoryFloor 삽입
          await trx
            .insert(schema.DormitoryFloor)
            .values({ dormitoryId, floor });

          // 방금 삽입한 DormitoryFloor의 id 가져오기
          const [{ id: dormitoryFloorId }] = await trx
            .select({ id: schema.DormitoryFloor.id })
            .from(schema.DormitoryFloor)
            .where(
              and(
                eq(schema.DormitoryFloor.dormitoryId, dormitoryId),
                eq(schema.DormitoryFloor.floor, floor),
              ),
            );

          // LaundryRoom 생성
          const roomCount = dormitory.code === 'ARE' ? 4 : 1; // 아름관은 층당 4개
          for (let roomIndex = 1; roomIndex <= roomCount; roomIndex++) {
            const laundryRoomName = `${dormitory.name} ${floor}층 ${roomIndex}호`;
            const laundryRoomNameEng = `${dormitory.nameEng} ${floor}F Room ${roomIndex}`;
            await trx.insert(schema.LaundryRoom).values({
              dormitoryId,
              dormitoryFloorId,
              name: laundryRoomName,
              nameEng: laundryRoomNameEng,
            });

            // 방금 삽입한 LaundryRoom의 id 가져오기
            const [{ id: laundryRoomId }] = await trx
              .select({ id: schema.LaundryRoom.id })
              .from(schema.LaundryRoom)
              .where(
                and(
                  eq(schema.LaundryRoom.dormitoryFloorId, dormitoryFloorId),
                  eq(schema.LaundryRoom.name, laundryRoomName),
                ),
              );

            // Step 3: LM 생성
            const lmBaseCode = `${dormitory.code}_${floor}_${laundryRoomIndex}`;
            if (dormitory.code === 'ARE') {
              // 아름관 규칙
              if (roomIndex % 2 === 1) {
                // 홀수 번째 방
                await trx.insert(schema.LM).values([
                  {
                    laundryRoomId,
                    lmTypeEnumId: resLmtype[0].id,
                    code: `${lmBaseCode}_W_1`,
                  },
                  {
                    laundryRoomId,
                    lmTypeEnumId: resLmtype[0].id,
                    code: `${lmBaseCode}_W_2`,
                  },
                ]);
              } else {
                // 짝수 번째 방
                await trx.insert(schema.LM).values([
                  {
                    laundryRoomId,
                    lmTypeEnumId: resLmtype[0].id,
                    code: `${lmBaseCode}_W_1`,
                  },
                  {
                    laundryRoomId,
                    lmTypeEnumId: resLmtype[0].id,
                    code: `${lmBaseCode}_W_2`,
                  },
                  {
                    laundryRoomId,
                    lmTypeEnumId: resLmtype[1].id,
                    code: `${lmBaseCode}_D_1`,
                  },
                ]);
              }
            } else {
              // 다른 기숙사 규칙
              await trx.insert(schema.LM).values([
                {
                  laundryRoomId,
                  lmTypeEnumId: resLmtype[0].id,
                  code: `${lmBaseCode}_W_1`,
                },
                {
                  laundryRoomId,
                  lmTypeEnumId: resLmtype[0].id,
                  code: `${lmBaseCode}_W_2`,
                },
                {
                  laundryRoomId,
                  lmTypeEnumId: resLmtype[1].id,
                  code: `${lmBaseCode}_D_1`,
                },
              ]);
            }
            laundryRoomIndex++;
          }
        }
        console.log(`Dormitory ${dormitory.name} is created`);
      }
      const lmIds = await trx
        .select({ id: schema.LM.id })
        .from(schema.LM)

        .where(
          or(
            eq(schema.LM.code, 'MIR_15_1_W_1'),
            eq(schema.LM.code, 'MIR_15_1_W_2'),
            eq(schema.LM.code, 'MIR_15_1_D_1'),
            eq(schema.LM.code, 'ARE_4_2_W_1'),
            eq(schema.LM.code, 'ARE_4_2_D_1'),
          ),
        )
        .execute();

      const trackers = lmIds.map((lm) => ({
        lmId: lm.id,
      }));
      console.log(JSON.stringify(trackers));
      await trx.insert(schema.Tracker).values(trackers).execute();

      const users = [
        {
          email: 'john.doe@example.com',
          password: 'password123',
          name: 'John Doe',
          dormitoryId: 3,
          dormitoryFloor: 3,
          dormitoryRoom: 305,
          gender: 2,
          userTypeEnumId: 1,
        },
        {
          email: 'jane.smith@example.com',
          password: 'password456',
          name: 'Jane Smith',
          dormitoryId: 4,
          dormitoryFloor: 3,
          dormitoryRoom: 212,
          gender: 2,
          userTypeEnumId: 1,
        },
        {
          email: 'mark.jones@example.com',
          password: 'password789',
          name: 'Mark Jones',
          dormitoryId: 1,
          dormitoryFloor: 3,
          dormitoryRoom: 301,
          gender: 1,
          userTypeEnumId: 1,
        },
        {
          email: 'emily.white@example.com',
          password: 'password321',
          name: 'Emily White',
          dormitoryId: 3,
          dormitoryFloor: 3,
          dormitoryRoom: 301,
          gender: 2,
          userTypeEnumId: 1,
        },
        {
          email: 'alex.brown@example.com',
          password: 'password654',
          name: 'Alex Brown',
          dormitoryId: 1,
          dormitoryFloor: 3,
          dormitoryRoom: 203,
          gender: 1,
          userTypeEnumId: 1,
        },
      ] as schema.UserInsertT[];
      const resDorm = await trx.select().from(schema.Dormitory).execute();
      console.log(JSON.stringify(resDorm));
      // User 초기 데이터 삽입
      await trx.insert(schema.User).values(users);
      return true;
    });
    return res;
  }
}
