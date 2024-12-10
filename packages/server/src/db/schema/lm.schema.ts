import {
  int,
  varchar,
  timestamp,
  mysqlTable,
  foreignKey,
} from 'drizzle-orm/mysql-core';
import { User } from './user.schema';
import { LaundryRoom } from './dormitory.schema';
import { LMTypeEnum } from './enum.schema'; // 예시로 LMTypeEnum을 사용합니다. 실제 Enum 테이블을 정의해야 함.

export const LM = mysqlTable(
  'lm',
  {
    id: int('id').autoincrement().primaryKey().notNull(),
    laundryRoomId: int('laundry_room_id').notNull(), // LaundryRoom 테이블과 연결
    lmTypeEnumId: int('lm_type_enum_id').notNull(), // LMTypeEnum 테이블과 연결
    code: varchar('code', { length: 20 }).notNull(), // 기숙사, 층, 방, 타입, 번호를 나타내는 코드
  },
  (table) => ({
    laundryRoomIdFk: foreignKey({
      columns: [table.laundryRoomId],
      foreignColumns: [LaundryRoom.id],
      name: 'lau_machine_laundry_room_id_fk', // 외래키 이름
    }),
    lmTypeEnumIdFk: foreignKey({
      columns: [table.lmTypeEnumId],
      foreignColumns: [LMTypeEnum.id],
      name: 'lau_machine_lm_type_enum_id_fk', // 외래키 이름
    }),
  }),
);

export const FLM = mysqlTable(
  'flm', // 유저의 FLM 기록 테이블
  {
    id: int('id').autoincrement().primaryKey().notNull(),
    userId: int('user_id').notNull(), // User 테이블과 연결
    lmId: int('lm_id').notNull(), // LaundryMachine 테이블과 연결
    priority: int('priority').default(1).notNull(), // 우선순위 (1이 가장 높은 우선순위)
    createdAt: timestamp('created_at').defaultNow().notNull(), // 생성 시간
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(), // 수정 시간
    deletedAt: timestamp('deleted_at'), // 삭제 시간
  },
  (table) => ({
    userIdFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [User.id],
      name: 'flm_user_id_fk', // 외래키 이름
    }),
    lmIdFk: foreignKey({
      columns: [table.lmId],
      foreignColumns: [LM.id],
      name: 'flm_lm_id_fk', // 외래키 이름
    }),
  }),
);
