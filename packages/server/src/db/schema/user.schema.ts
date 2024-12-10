import {
  int,
  varchar,
  timestamp,
  mysqlTable,
  foreignKey,
} from 'drizzle-orm/mysql-core';
import { UserTypeEnum } from './enum.schema'; // UserTypeEnum이 정의된 위치
import { Dormitory } from './dormitory.schema'; // Dormitory가 정의된 위치

export const User = mysqlTable(
  'user',
  {
    id: int('id').autoincrement().primaryKey().notNull(),
    email: varchar('email', { length: 100 }).notNull(),
    loginId: varchar('login_id', { length: 100 }).notNull(),
    password: varchar('password', { length: 100 }).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    dormitoryId: int('dormitory_id').notNull(),
    userTypeEnumId: int('user_type_enum_id').notNull(),
    dormitoryFloor: int('dormitory_floor'),
    dormitoryRoom: int('dormitory_room'),
    gender: int('gender'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => ({
    dormitoryIdFk: foreignKey({
      columns: [table.dormitoryId],
      foreignColumns: [Dormitory.id],
      name: 'usr_dormitory_id_fk',
    }),
    userTypeEnumIdFk: foreignKey({
      columns: [table.userTypeEnumId],
      foreignColumns: [UserTypeEnum.id],
      name: 'usr_user_type_enum_id_fk',
    }),
  }),
);
