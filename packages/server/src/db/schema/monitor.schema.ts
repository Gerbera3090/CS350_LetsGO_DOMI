import {
  int,
  varchar,
  timestamp,
  datetime,
  mysqlTable,
  foreignKey,
} from 'drizzle-orm/mysql-core';
import { LM } from './lm.schema';
import { InferSelectModel } from 'drizzle-orm';

export const Track = mysqlTable(
  'track',
  {
    id: int('id').autoincrement().primaryKey().notNull(),
    lmId: int('lm_id').notNull(), // LaundryMachine 테이블과 연결
    trackerId: int('tracker_id').notNull(), // Tracker 테이블과 연결
    intensity: int('intensity'), // 전송된 강도
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

export type TrackT = InferSelectModel<typeof Track>;
