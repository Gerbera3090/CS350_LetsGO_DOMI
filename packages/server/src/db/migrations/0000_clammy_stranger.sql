CREATE TABLE `dormitory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(20) NOT NULL,
	`name_eng` varchar(50) NOT NULL,
	`max_floor` int NOT NULL,
	`gender` int NOT NULL,
	`code` varchar(10) NOT NULL,
	CONSTRAINT `dormitory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dormitory_floor` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dormitory_id` int NOT NULL,
	`floor` int NOT NULL,
	CONSTRAINT `dormitory_floor_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `laundry_room` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(20) NOT NULL,
	`name_eng` varchar(50) NOT NULL,
	`dormitory_id` int NOT NULL,
	`dormitory_floor_id` int NOT NULL,
	CONSTRAINT `laundry_room_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lm_status_enum` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(30) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `lm_status_enum_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lm_type_enum` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(30) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `lm_type_enum_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `report_status_enum` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(30) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `report_status_enum_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_type_enum` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(30) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `user_type_enum_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `flm` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`lm_id` int NOT NULL,
	`priority` int NOT NULL DEFAULT 1,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `flm_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lm` (
	`id` int AUTO_INCREMENT NOT NULL,
	`laundry_room_id` int NOT NULL,
	`lm_type_enum_id` int NOT NULL,
	`code` varchar(20) NOT NULL,
	CONSTRAINT `lm_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reserve_alarm` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lm_id` int NOT NULL,
	`user_id` int NOT NULL,
	`alarmed` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reserve_alarm_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `track` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lm_id` int NOT NULL,
	`tracker_id` int NOT NULL,
	`intensity` int NOT NULL,
	`last` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `track_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tracker` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lm_id` int NOT NULL,
	CONSTRAINT `tracker_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `usage_alarm` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lm_id` int NOT NULL,
	`user_id` int NOT NULL,
	`alarmed` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `usage_alarm_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(100) NOT NULL,
	`password` varchar(100) NOT NULL,
	`name` varchar(100) NOT NULL,
	`dormitory_id` int NOT NULL,
	`user_type_enum_id` int NOT NULL DEFAULT 1,
	`dormitory_floor` int,
	`dormitory_room` int,
	`gender` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `user_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `report` (
	`id` int AUTO_INCREMENT NOT NULL,
	`report_status_enum_id` int NOT NULL,
	`user_id` int NOT NULL,
	`lm_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `report_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `dormitory_floor` ADD CONSTRAINT `dor_flo_dormitory_id_fk` FOREIGN KEY (`dormitory_id`) REFERENCES `dormitory`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `laundry_room` ADD CONSTRAINT `lau_room_dormitory_id_fk` FOREIGN KEY (`dormitory_id`) REFERENCES `dormitory`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `laundry_room` ADD CONSTRAINT `lau_room_dormitory_floor_id_fk` FOREIGN KEY (`dormitory_floor_id`) REFERENCES `dormitory_floor`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `flm` ADD CONSTRAINT `flm_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `flm` ADD CONSTRAINT `flm_lm_id_fk` FOREIGN KEY (`lm_id`) REFERENCES `lm`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lm` ADD CONSTRAINT `lau_machine_laundry_room_id_fk` FOREIGN KEY (`laundry_room_id`) REFERENCES `laundry_room`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lm` ADD CONSTRAINT `lau_machine_lm_type_enum_id_fk` FOREIGN KEY (`lm_type_enum_id`) REFERENCES `lm_type_enum`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reserve_alarm` ADD CONSTRAINT `reserve_alarm_lm_fk` FOREIGN KEY (`lm_id`) REFERENCES `lm`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reserve_alarm` ADD CONSTRAINT `reserve_alarm_user_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `track` ADD CONSTRAINT `track_laundry_machine_id_fk` FOREIGN KEY (`lm_id`) REFERENCES `lm`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `track` ADD CONSTRAINT `track_tracker_id_fk` FOREIGN KEY (`tracker_id`) REFERENCES `tracker`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tracker` ADD CONSTRAINT `tracker_lm_id_fk` FOREIGN KEY (`lm_id`) REFERENCES `lm`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `usage_alarm` ADD CONSTRAINT `usage_alarm_lm_fk` FOREIGN KEY (`lm_id`) REFERENCES `lm`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `usage_alarm` ADD CONSTRAINT `usage_alarm_user_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user` ADD CONSTRAINT `usr_dormitory_id_fk` FOREIGN KEY (`dormitory_id`) REFERENCES `dormitory`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user` ADD CONSTRAINT `usr_user_type_enum_id_fk` FOREIGN KEY (`user_type_enum_id`) REFERENCES `user_type_enum`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `report` ADD CONSTRAINT `rep_report_status_enum_fk` FOREIGN KEY (`report_status_enum_id`) REFERENCES `report_status_enum`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `report` ADD CONSTRAINT `rep_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `report` ADD CONSTRAINT `rep_lm_id_fk` FOREIGN KEY (`lm_id`) REFERENCES `lm`(`id`) ON DELETE no action ON UPDATE no action;