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

// ReportStatusEnum 테이블
export const LMStatusEnum = mysqlTable('lm_status_enum', {
  id: int('id').autoincrement().primaryKey().notNull(),
  name: varchar('name', { length: 30 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

// LM Type Enum
export enum LMTypeE {
  Washer = 1, // 세탁기
  Dryer, // 건조기
}

// User Type Enum
export enum UserTypeE {
  Resident = 1, // 학생
  Supervisor, // 사감
}

// Report Status Enum
export enum ReportStatusE {
  Available = 1, // 사용 가능
  Broken, // 고장
  OnRepair, // 수리 중
}

// LM Status Enum
export enum LMStatusE {
  Available = 1, // 사용 가능
  Occupied, // 점유 중
  Using, // 사용 중
}
