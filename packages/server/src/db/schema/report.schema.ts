import { mysqlTable, int, timestamp, foreignKey } from 'drizzle-orm/mysql-core';
import { ReportStatusEnum } from './enum.schema';
import { User } from './user.schema';
import { LM } from './lm.schema';
import { InferSelectModel } from 'drizzle-orm';

// Report 테이블
export const Report = mysqlTable(
  'report',
  {
    id: int('id').autoincrement().primaryKey().notNull(), // PK
    reportStatusEnumId: int('report_status_enum_id') // FK to ReportStatusEnum
      .notNull(),
    userId: int('user_id') // FK to User
      .notNull(),
    lmId: int('lm_id').notNull(), // FK to LM

    createdAt: timestamp('created_at').defaultNow().notNull(), // Default value: CURRENT_TIMESTAMP
  },
  (table) => ({
    reportStatusEnumFk: foreignKey({
      columns: [table.reportStatusEnumId],
      foreignColumns: [ReportStatusEnum.id], // Replace 'id' with the actual column reference from ReportStatusEnum table
      name: 'rep_report_status_enum_fk', // Name of the foreign key constraint
    }),
    userFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [User.id], // Replace 'id' with the actual column reference from User table
      name: 'rep_user_id_fk', // Name of the foreign key constraint
    }),
    lmFk: foreignKey({
      columns: [table.lmId],
      foreignColumns: [LM.id], // Replace 'id' with the actual column reference from LM table
      name: 'rep_lm_id_fk', // Name of the foreign key constraint
    }),
  }),
);

export type ReportT = InferSelectModel<typeof Report>;
