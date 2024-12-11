import {
  int,
  varchar,
  timestamp,
  datetime,
  boolean,
  mysqlTable,
  foreignKey,
} from 'drizzle-orm/mysql-core';
import { LM } from './lm.schema';
import { User } from './user.schema';
import { InferSelectModel } from 'drizzle-orm';

export const Track = mysqlTable(
  'track',
  {
    id: int('id').autoincrement().primaryKey().notNull(),
    lmId: int('lm_id').notNull(), // LaundryMachine 테이블과 연결
    trackerId: int('tracker_id').notNull(), // Tracker 테이블과 연결
    intensity: int('intensity').notNull(), // 전송된 강도
    last: int('last').notNull().notNull().default(0), // 강도가 일정 이상일 경우 지속 시간
    createdAt: timestamp('created_at').defaultNow().notNull(), // 생성 시간
  },
  (table) => ({
    laundryMachineIdFk: foreignKey({
      columns: [table.lmId],
      foreignColumns: [LM.id],
      name: 'track_laundry_machine_id_fk', // 외래키 이름
    }),
    trackerIdFk: foreignKey({
      columns: [table.trackerId],
      foreignColumns: [Tracker.id],
      name: 'track_tracker_id_fk', // 외래키 이름
    }),
  }),
);

export const Tracker = mysqlTable(
  'tracker',
  {
    id: int('id').autoincrement().primaryKey().notNull(),
    lmId: int('lm_id').notNull(), // LaundryMachine 테이블과 연결
  },
  (table) => ({
    lmIdFk: foreignKey({
      columns: [table.lmId],
      foreignColumns: [LM.id],
      name: 'tracker_lm_id_fk', // 외래키 이름
    }),
  }),
);

// UsageAlarm 테이블
export const UsageAlarm = mysqlTable(
  'usage_alarm', // 테이블 이름
  {
    id: int('id').autoincrement().primaryKey().notNull(), // PK
    lmId: int('lm_id') // FK to LM
      .notNull(),
    userId: int('user_id') // FK to User
      .notNull(),
    alarmed: boolean('alarmed') // Boolean 필드
      .default(false)
      .notNull(),
    createdAt: timestamp('created_at') // 생성 시간
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    lmFk: foreignKey({
      columns: [table.lmId],
      foreignColumns: [LM.id], // LM 테이블의 id를 참조 (수정 필요)
      name: 'usage_alarm_lm_fk', // 외래키 이름
    }),
    userFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [User.id], // User 테이블의 id를 참조 (수정 필요)
      name: 'usage_alarm_user_fk', // 외래키 이름
    }),
  }),
);

export type TrackT = InferSelectModel<typeof Track>;
