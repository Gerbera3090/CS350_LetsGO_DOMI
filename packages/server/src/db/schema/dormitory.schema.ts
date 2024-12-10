import { int, varchar, mysqlTable, foreignKey } from 'drizzle-orm/mysql-core';
import { InferInsertModel } from 'drizzle-orm';
// Dormitory 테이블
export const Dormitory = mysqlTable('dormitory', {
  id: int('id').autoincrement().primaryKey().notNull(),
  name: varchar('name', { length: 20 }).notNull(),
  nameEng: varchar('name_eng', { length: 50 }).notNull(),
  maxFloor: int('max_floor').notNull(), // 최고층 (유저가 이상하게 적기 방지)
  gender: int('gender').notNull(), // 성별 (1: 남성, 2: 여성)
  code: varchar('code', { length: 10 }).notNull(),
});

// DormitoryFloor 테이블
export const DormitoryFloor = mysqlTable(
  'dormitory_floor',
  {
    id: int('id').autoincrement().primaryKey().notNull(),
    dormitoryId: int('dormitory_id').notNull(), // Dormitory 테이블과 연결
    floor: int('floor').notNull(),
  },
  (table) => ({
    dormitoryIdFk: foreignKey({
      columns: [table.dormitoryId],
      foreignColumns: [Dormitory.id],
      name: 'dor_flo_dormitory_id_fk', // 외래키 이름
    }),
  }),
);

// LaundryRoom 테이블
export const LaundryRoom = mysqlTable(
  'laundry_room',
  {
    id: int('id').autoincrement().primaryKey().notNull(),
    name: varchar('name', { length: 20 }).notNull(),
    nameEng: varchar('name_eng', { length: 50 }).notNull(),
    dormitoryId: int('dormitory_id').notNull(), // Dormitory 테이블과 연결
    dormitoryFloorId: int('dormitory_floor_id').notNull(), // DormitoryFloor 테이블과 연결
  },
  (table) => ({
    dormitoryIdFk: foreignKey({
      columns: [table.dormitoryId],
      foreignColumns: [Dormitory.id],
      name: 'lau_room_dormitory_id_fk', // 외래키 이름
    }),
    dormitoryFloorIdFk: foreignKey({
      columns: [table.dormitoryFloorId],
      foreignColumns: [DormitoryFloor.id],
      name: 'lau_room_dormitory_floor_id_fk', // 외래키 이름
    }),
  }),
);

export type DormitoryInsertT = InferInsertModel<typeof Dormitory>;
export type DormitoryFloorInsertT = InferInsertModel<typeof DormitoryFloor>;
export type LaundryRoomInsertT = InferInsertModel<typeof LaundryRoom>;
