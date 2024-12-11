import { int, varchar, timestamp, mysqlTable } from 'drizzle-orm/mysql-core';

// LaundryMachineTypeEnum 테이블
export const LMTypeEnum = mysqlTable('lm_type_enum', {
  id: int('id').autoincrement().primaryKey().notNull(),
  name: varchar('name', { length: 30 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

// UserTypeEnum 테이블
export const UserTypeEnum = mysqlTable('user_type_enum', {
  id: int('id').autoincrement().primaryKey().notNull(),
  name: varchar('name', { length: 30 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

// ReportStatusEnum 테이블
export const ReportStatusEnum = mysqlTable('report_status_enum', {
  id: int('id').autoincrement().primaryKey().notNull(),
  name: varchar('name', { length: 30 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});
