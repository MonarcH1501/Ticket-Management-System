-- Converted from MySQL/HeidiSQL dump to PostgreSQL.
-- Original file: C:\Users\Media\Downloads\ticketingM(2).sql
BEGIN;
SET client_encoding = 'UTF8';

CREATE TABLE IF NOT EXISTS "departments" (
  "id" bigserial NOT NULL,
  "name" varchar(255) NOT NULL,
  "head_id" bigint DEFAULT NULL,
  "created_at" timestamp NULL DEFAULT NULL,
  "updated_at" timestamp NULL DEFAULT NULL,
  PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "failed_jobs" (
  "id" bigserial NOT NULL,
  "uuid" varchar(255) NOT NULL,
  "connection" text NOT NULL,
  "queue" text NOT NULL,
  "payload" text NOT NULL,
  "exception" text NOT NULL,
  "failed_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "migrations" (
  "id" serial NOT NULL,
  "migration" varchar(255) NOT NULL,
  "batch" integer NOT NULL,
  PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "model_has_permissions" (
  "permission_id" bigint NOT NULL,
  "model_type" varchar(255) NOT NULL,
  "model_id" bigint NOT NULL,
  PRIMARY KEY ("permission_id","model_id","model_type")
);
CREATE TABLE IF NOT EXISTS "model_has_roles" (
  "role_id" bigint NOT NULL,
  "model_type" varchar(255) NOT NULL,
  "model_id" bigint NOT NULL,
  PRIMARY KEY ("role_id","model_id","model_type")
);
CREATE TABLE IF NOT EXISTS "notifications" (
  "id" char(36) NOT NULL,
  "type" varchar(255) NOT NULL,
  "notifiable_type" varchar(255) NOT NULL,
  "notifiable_id" bigint NOT NULL,
  "data" text NOT NULL,
  "read_at" timestamp NULL DEFAULT NULL,
  "created_at" timestamp NULL DEFAULT NULL,
  "updated_at" timestamp NULL DEFAULT NULL,
  PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
  "email" varchar(255) NOT NULL,
  "token" varchar(255) NOT NULL,
  "created_at" timestamp NULL DEFAULT NULL,
  PRIMARY KEY ("email")
);
CREATE TABLE IF NOT EXISTS "permissions" (
  "id" bigserial NOT NULL,
  "name" varchar(255) NOT NULL,
  "guard_name" varchar(255) NOT NULL,
  "created_at" timestamp NULL DEFAULT NULL,
  "updated_at" timestamp NULL DEFAULT NULL,
  PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "personal_access_tokens" (
  "id" bigserial NOT NULL,
  "tokenable_type" varchar(255) NOT NULL,
  "tokenable_id" bigint NOT NULL,
  "name" varchar(255) NOT NULL,
  "token" varchar(64) NOT NULL,
  "abilities" text,
  "last_used_at" timestamp NULL DEFAULT NULL,
  "expires_at" timestamp NULL DEFAULT NULL,
  "created_at" timestamp NULL DEFAULT NULL,
  "updated_at" timestamp NULL DEFAULT NULL,
  PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "positions" (
  "id" bigserial NOT NULL,
  "name" varchar(255) NOT NULL,
  "created_at" timestamp NULL DEFAULT NULL,
  "updated_at" timestamp NULL DEFAULT NULL,
  PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "roles" (
  "id" bigserial NOT NULL,
  "name" varchar(255) NOT NULL,
  "guard_name" varchar(255) NOT NULL,
  "created_at" timestamp NULL DEFAULT NULL,
  "updated_at" timestamp NULL DEFAULT NULL,
  PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "role_has_permissions" (
  "permission_id" bigint NOT NULL,
  "role_id" bigint NOT NULL,
  PRIMARY KEY ("permission_id","role_id")
);
CREATE TABLE IF NOT EXISTS "tickets" (
  "id" bigserial NOT NULL,
  "ticket_code" varchar(255) NOT NULL,
  "title" varchar(255) NOT NULL,
  "description" text NOT NULL,
  "department_id" bigint NOT NULL,
  "ticket_category_id" bigint NOT NULL,
  "created_by" bigint NOT NULL,
  "unit_id" bigint DEFAULT NULL,
  "current_status" varchar(255) NOT NULL,
  "current_approver_id" bigint DEFAULT NULL,
  "pic_id" bigint DEFAULT NULL,
  "priority" varchar(255) DEFAULT NULL,
  "due_date" date DEFAULT NULL,
  "closed_at" timestamp NULL DEFAULT NULL,
  "created_at" timestamp NULL DEFAULT NULL,
  "updated_at" timestamp NULL DEFAULT NULL,
  PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "ticket_approvals" (
  "id" bigserial NOT NULL,
  "ticket_id" bigint NOT NULL,
  "approved_by" bigint NOT NULL,
  "role_as" varchar(255) NOT NULL,
  "status" varchar(255) NOT NULL,
  "notes" text,
  "approved_at" timestamp NULL DEFAULT NULL,
  "created_at" timestamp NULL DEFAULT NULL,
  "updated_at" timestamp NULL DEFAULT NULL,
  PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "ticket_attachments" (
  "id" bigserial NOT NULL,
  "ticket_id" bigint NOT NULL,
  "file_path" varchar(255) NOT NULL,
  "file_name" varchar(255) NOT NULL,
  "mime_type" varchar(255) NOT NULL,
  "uploaded_by" bigint NOT NULL,
  "stage" varchar(255) NOT NULL DEFAULT 'initial',
  "created_at" timestamp NULL DEFAULT NULL,
  "updated_at" timestamp NULL DEFAULT NULL,
  "deleted_at" timestamp NULL DEFAULT NULL,
  PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "ticket_categories" (
  "id" bigserial NOT NULL,
  "code" varchar(255) NOT NULL,
  "name" varchar(255) NOT NULL,
  "department_id" bigint DEFAULT NULL,
  "description" text,
  "is_active" boolean NOT NULL DEFAULT true,
  "created_at" timestamp NULL DEFAULT NULL,
  "updated_at" timestamp NULL DEFAULT NULL,
  PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "ticket_forward_histories" (
  "id" bigserial NOT NULL,
  "ticket_id" bigint NOT NULL,
  "from_department_id" bigint NOT NULL,
  "to_department_id" bigint NOT NULL,
  "forwarded_by" bigint NOT NULL,
  "notes" text,
  "forwarded_at" timestamp NOT NULL,
  PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "units" (
  "id" bigserial NOT NULL,
  "name" varchar(255) NOT NULL,
  "head_id" bigint DEFAULT NULL,
  "created_at" timestamp NULL DEFAULT NULL,
  "updated_at" timestamp NULL DEFAULT NULL,
  PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "users" (
  "id" bigserial NOT NULL,
  "unit_id" bigint DEFAULT NULL,
  "department_id" bigint DEFAULT NULL,
  "position_id" bigint DEFAULT NULL,
  "name" varchar(255) NOT NULL,
  "email" varchar(255) NOT NULL,
  "email_verified_at" timestamp NULL DEFAULT NULL,
  "password" varchar(255) NOT NULL,
  "remember_token" varchar(100) DEFAULT NULL,
  "created_at" timestamp NULL DEFAULT NULL,
  "updated_at" timestamp NULL DEFAULT NULL,
  PRIMARY KEY ("id")
);

INSERT INTO "departments" ("id", "name", "head_id", "created_at", "updated_at") VALUES
	(1, 'SDM', NULL, NULL, NULL),
	(2, 'Akademik', NULL, NULL, NULL),
	(3, 'TI', 2, NULL, NULL),
	(4, 'Sarpras', NULL, NULL, NULL),
	(5, 'Keuangan', NULL, NULL, NULL),
	(6, 'Penggembalaan', NULL, NULL, NULL),
	(7, 'Umum', NULL, NULL, NULL),
	(8, 'Unit Sekolah', NULL, NULL, NULL);
INSERT INTO "migrations" ("id", "migration", "batch") VALUES
	(1, '2014_10_12_000000_create_users_table', 1),
	(2, '2014_10_12_100000_create_password_reset_tokens_table', 1),
	(3, '2019_08_19_000000_create_failed_jobs_table', 1),
	(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
	(5, '2026_02_09_071553_create_departments_table', 1),
	(6, '2026_02_09_071553_create_units_table', 1),
	(7, '2026_02_09_071554_create_positions_table', 1),
	(8, '2026_02_09_074518_add_structure_to_users_table', 1),
	(9, '2026_02_09_074627_create_ticket_categories_table', 1),
	(10, '2026_02_09_075156_create_tickets_table', 1),
	(11, '2026_02_09_075228_create_ticket_approvals_table', 1),
	(12, '2026_02_09_082426_create_permission_tables', 2),
	(13, '2026_02_12_034324_add_pic_id_to_tickets_table', 3),
	(14, '2026_02_26_070420_create_ticket_attachments_table', 4),
	(15, '2026_02_26_074253_add_soft_deletes_to_ticket_attachments', 5),
	(17, '2026_05_05_021028_add_unit_id_to_tickets_table', 6),
	(18, '2026_05_19_082910_add_stage_to_ticket_attachment_table', 7),
	(19, '2026_05_20_043036_create_ticket_forward_histories_table', 8),
	(20, '2026_05_21_000000_add_performance_indexes_to_tickets_table', 9),
	(21, '2026_05_25_000000_create_notifications_table', 10);
INSERT INTO "model_has_roles" ("role_id", "model_type", "model_id") VALUES
	(1, 'App\\Models\\User', 1),
	(5, 'App\\Models\\User', 2),
	(4, 'App\\Models\\User', 5),
	(3, 'App\\Models\\User', 7),
	(6, 'App\\Models\\User', 8),
	(4, 'App\\Models\\User', 9),
	(5, 'App\\Models\\User', 10),
	(6, 'App\\Models\\User', 11),
	(3, 'App\\Models\\User', 12),
	(3, 'App\\Models\\User', 13),
	(4, 'App\\Models\\User', 13),
	(3, 'App\\Models\\User', 14);
INSERT INTO "permissions" ("id", "name", "guard_name", "created_at", "updated_at") VALUES
	(1, 'manage_users', 'sanctum', '2026-02-09 01:25:29', '2026-02-09 23:47:31'),
	(2, 'manage_master_data', 'sanctum', '2026-02-09 01:25:29', '2026-02-09 23:47:31'),
	(3, 'create_ticket', 'sanctum', '2026-02-09 01:25:29', '2026-02-09 23:47:31'),
	(4, 'approve_ticket', 'sanctum', '2026-02-09 01:25:29', '2026-02-09 23:47:31'),
	(5, 'assign_pic', 'sanctum', '2026-02-09 01:25:29', '2026-02-09 23:47:31'),
	(6, 'view_all_ticket', 'sanctum', '2026-02-09 01:25:29', '2026-02-09 23:47:31'),
	(7, 'force_ticket_update', 'sanctum', '2026-02-09 01:25:29', '2026-02-09 23:47:31'),
	(8, 'submit_ticket', 'sanctum', '2026-02-24 03:06:12', '2026-02-24 03:06:13');
INSERT INTO "personal_access_tokens" ("id", "tokenable_type", "tokenable_id", "name", "token", "abilities", "last_used_at", "expires_at", "created_at", "updated_at") VALUES
	(1, 'App\\Models\\User', 1, 'api-token', '77d83a546f8f4a235277e5c3ca2238f7aeebfd759a1654597d290c402d493a2b', '["*"]', '2026-02-09 23:41:53', NULL, '2026-02-09 19:32:24', '2026-02-09 23:41:53'),
	(2, 'App\\Models\\User', 1, 'api-token', 'b9a0e996fb8e1c8aca2cd329855405c3c3302afe169a73cae864b3069f89f2c6', '["*"]', '2026-02-09 23:01:19', NULL, '2026-02-09 20:44:11', '2026-02-09 23:01:19'),
	(3, 'App\\Models\\User', 1, 'api-token', 'ea01ca41c73609e35303bd1cc608a9f2c53b7e90faeb3f48a0f350bdd76f2712', '["*"]', '2026-02-09 23:30:45', NULL, '2026-02-09 23:01:26', '2026-02-09 23:30:45'),
	(4, 'App\\Models\\User', 1, 'api-token', 'fac05ef578e61c49a5c1f3eab0d5df6ff981ebec459fdd63fb3b27710a8f285c', '["*"]', '2026-02-09 23:31:31', NULL, '2026-02-09 23:31:24', '2026-02-09 23:31:31'),
	(5, 'App\\Models\\User', 1, 'api-token', '2941a126a4a6bc91df0f3552d834b4bca636af52fdeebceea8d4ba825ad77ce9', '["*"]', '2026-02-09 23:46:23', NULL, '2026-02-09 23:34:32', '2026-02-09 23:46:23'),
	(6, 'App\\Models\\User', 1, 'api-token', '851f3ef8837795e49454a8f51ca9071263329b7b875ab3183f7b6c5d7ff9dae6', '["*"]', '2026-02-09 23:48:04', NULL, '2026-02-09 23:43:10', '2026-02-09 23:48:04'),
	(7, 'App\\Models\\User', 1, 'api-token', 'a1fa36d28fb7a6fea3bc3d898401806603a0d481ddd61ab3e501f950663ac705', '["*"]', '2026-02-10 00:45:21', NULL, '2026-02-09 23:48:08', '2026-02-10 00:45:21'),
	(8, 'App\\Models\\User', 2, 'api-token', 'b32222b66f29c49a25551775ba017c5ead0ff3ccb8cc5a8aed859e6da760d3f6', '["*"]', '2026-02-10 00:51:31', NULL, '2026-02-10 00:49:44', '2026-02-10 00:51:31'),
	(9, 'App\\Models\\User', 2, 'api-token', '586bd3477dd92f4dbd9556a8e5dc4916960a1451a652b805abb0abd4ce42bc92', '["*"]', '2026-02-10 00:51:48', NULL, '2026-02-10 00:51:37', '2026-02-10 00:51:48'),
	(10, 'App\\Models\\User', 2, 'api-token', '60ee07098d0d9092fb919c9f1fafa9efe54f0f68d0a74f284ac3437b66b9e1d6', '["*"]', '2026-02-10 18:20:37', NULL, '2026-02-10 18:20:22', '2026-02-10 18:20:37'),
	(11, 'App\\Models\\User', 7, 'api-token', 'f416540eddfe10195f74aef5c3f31a414b6cd9d03d3004b5af4eeab465b50885', '["*"]', '2026-02-10 23:57:20', NULL, '2026-02-10 18:43:19', '2026-02-10 23:57:20'),
	(12, 'App\\Models\\User', 5, 'api-token', '33e3ef51721145fe8e56596fd7c0afd66852f4589ec6e966c2245d31e9baba91', '["*"]', '2026-02-10 19:15:06', NULL, '2026-02-10 18:47:52', '2026-02-10 19:15:06'),
	(13, 'App\\Models\\User', 5, 'api-token', '3468f1be07d85b30563ddf77bfea79a969e6c7f8857548e13369648701e766fc', '["*"]', '2026-02-10 19:15:37', NULL, '2026-02-10 19:15:27', '2026-02-10 19:15:37'),
	(14, 'App\\Models\\User', 5, 'api-token', 'a2ecbc0324271aaa7544355a09979ef207313007b6e617ff43e29e5edbd574ba', '["*"]', '2026-02-10 19:18:11', NULL, '2026-02-10 19:18:01', '2026-02-10 19:18:11'),
	(15, 'App\\Models\\User', 5, 'api-token', 'c92d36315a44183db5b0e3f699b2985aef6aec7552b7b8ab412a89db98cbfb76', '["*"]', '2026-02-10 20:43:44', NULL, '2026-02-10 19:18:38', '2026-02-10 20:43:44'),
	(16, 'App\\Models\\User', 5, 'api-token', 'dcd5dbbfea0ecf7bfc7714fd48c90896a5f515f23e35f0ed367526a801addc29', '["*"]', '2026-02-10 23:52:40', NULL, '2026-02-10 23:33:50', '2026-02-10 23:52:40'),
	(17, 'App\\Models\\User', 5, 'api-token', 'a6c17ff4ec9a881e825bafa09e254c8cedbf98228fd4195928b50087353ea551', '["*"]', '2026-02-11 00:22:00', NULL, '2026-02-10 23:54:22', '2026-02-11 00:22:00'),
	(18, 'App\\Models\\User', 2, 'api-token', 'c27cec012b59780a4265859800f97040dc076e779c4340bc995d53558b4e7e56', '["*"]', '2026-02-23 20:37:55', NULL, '2026-02-11 00:22:32', '2026-02-23 20:37:55'),
	(19, 'App\\Models\\User', 2, 'api-token', 'c37b166a18766b9e9074d8e284c34132173e041e385b42a276b7a52ff765be7e', '["*"]', '2026-02-22 21:00:10', NULL, '2026-02-22 18:40:15', '2026-02-22 21:00:10'),
	(20, 'App\\Models\\User', 8, 'api-token', '5587c2c1095ff390e394c6ba7c7e5af1ec3cfd28aebad8c36efb9893a9257a28', '["*"]', NULL, NULL, '2026-02-22 20:55:52', '2026-02-22 20:55:52'),
	(21, 'App\\Models\\User', 8, 'api-token', '7053fc414526c7b33f15c1ae6f5692f49d65979837cdfd6d52bd16a8b729e3ec', '["*"]', '2026-02-23 20:08:57', NULL, '2026-02-23 19:51:38', '2026-02-23 20:08:57'),
	(22, 'App\\Models\\User', 8, 'api-token', '00c8a822279b2b8502914804cc8a3ba19db1f2e297ea30068dcf4ffb0a3027ef', '["*"]', '2026-02-23 20:19:08', NULL, '2026-02-23 20:09:02', '2026-02-23 20:19:08'),
	(23, 'App\\Models\\User', 8, 'api-token', '785478c6fcbeb80fa097e3dfcaea242b32fb7f9805edc60e5fc9cce30b6c7114', '["*"]', '2026-02-23 20:31:48', NULL, '2026-02-23 20:21:35', '2026-02-23 20:31:48'),
	(24, 'App\\Models\\User', 8, 'api-token', '31d39533decadb892efb6ae535a73d90719a3567b2188e3bda58e355638a6064', '["*"]', '2026-02-23 20:51:36', NULL, '2026-02-23 20:31:54', '2026-02-23 20:51:36'),
	(25, 'App\\Models\\User', 2, 'api-token', 'a9d8811465cbb51702f2b59728f078ad83e9c62522c11b944894bf919a9f5efc', '["*"]', NULL, NULL, '2026-02-23 20:35:11', '2026-02-23 20:35:11'),
	(26, 'App\\Models\\User', 5, 'api-token', 'b2f3463f7145ccd02f01b8946958e1a8e04889af2163cdd27b5bced325ef9449', '["*"]', NULL, NULL, '2026-02-23 20:36:42', '2026-02-23 20:36:42'),
	(27, 'App\\Models\\User', 2, 'api-token', '30b18b8c7952d05aeaa98ab40e54c396063e64d7eafda689a6915299e7cc47c9', '["*"]', '2026-02-24 01:52:21', NULL, '2026-02-23 20:38:21', '2026-02-24 01:52:21'),
	(28, 'App\\Models\\User', 8, 'api-token', '62e58dee86d33d4b731eb81899b77572e6a35d5fb6d76e54b41865b296935e99', '["*"]', '2026-02-24 01:43:38', NULL, '2026-02-23 20:51:42', '2026-02-24 01:43:38'),
	(29, 'App\\Models\\User', 2, 'api-token', '63045621519d38bd218dde704f76ada20a2203ab4edcc1122760a165417578c6', '["*"]', '2026-03-31 01:05:08', NULL, '2026-02-24 01:39:39', '2026-03-31 01:05:08'),
	(30, 'App\\Models\\User', 5, 'api-token', 'fd4eefd8091d6b23c694390e47db2c2aac79d985c801dd2a5eeebf85869a1c60', '["*"]', '2026-02-24 01:51:34', NULL, '2026-02-24 01:51:17', '2026-02-24 01:51:34'),
	(31, 'App\\Models\\User', 8, 'api-token', 'dd16911cd01fdbd58bf07cfb5672070bd18430c147b6f3fc81725eb6b1fdb3bd', '["*"]', '2026-02-24 02:08:29', NULL, '2026-02-24 02:08:06', '2026-02-24 02:08:29'),
	(32, 'App\\Models\\User', 2, 'api-token', '864c3288c03d92af9dc6d826376b584997810ef1abf62fb58f3705fdabbb70ed', '["*"]', '2026-02-25 01:01:06', NULL, '2026-02-25 01:00:47', '2026-02-25 01:01:06'),
	(33, 'App\\Models\\User', 8, 'api-token', '79506b7b0ea7d016e602e03b0699f5bbd98a71af895ddad28a4c1cb5d9316bf9', '["*"]', '2026-02-26 01:17:20', NULL, '2026-02-25 01:03:40', '2026-02-26 01:17:20'),
	(34, 'App\\Models\\User', 8, 'api-token', '073066e4feea49596f48a1af73edb5cd9ae202d51192d9ba078eeb41cada472e', '["*"]', '2026-03-06 00:56:13', NULL, '2026-02-25 20:24:05', '2026-03-06 00:56:13'),
	(35, 'App\\Models\\User', 2, 'api-token', 'bb7f375431de3af699545bf6ae3ffd4d80ec8a52a7042d04ad813c60350bb454', '["*"]', '2026-02-26 01:48:41', NULL, '2026-02-26 01:16:55', '2026-02-26 01:48:41'),
	(36, 'App\\Models\\User', 5, 'api-token', '57a6807ea68bfcc9784174dd9212fcd99d203cb692e972e7213f12c6d77150e7', '["*"]', '2026-03-26 00:49:41', NULL, '2026-02-26 01:51:48', '2026-03-26 00:49:41'),
	(37, 'App\\Models\\User', 2, 'api-token', '395e2367c8044b4f731767d0ec46f97747900ab6b325cb1fe8b522b2708a10cd', '["*"]', NULL, NULL, '2026-02-27 01:37:49', '2026-02-27 01:37:49'),
	(38, 'App\\Models\\User', 2, 'api-token', '510178093f17555fbf66fd1665873a722beeff5b37c8b701a045c312f027b8d0', '["*"]', NULL, NULL, '2026-02-27 01:37:50', '2026-02-27 01:37:50'),
	(39, 'App\\Models\\User', 2, 'api-token', '7ca2b467c912d440c1ebce77ea60ea47cd65b90159ea33bb1f6e385c6b8b3c0e', '["*"]', '2026-03-03 20:41:00', NULL, '2026-02-27 01:37:51', '2026-03-03 20:41:00'),
	(40, 'App\\Models\\User', 5, 'api-token', '6895d5f97e9e4b25f9f7f3e5dcf756a70e5a555e5677a12004d6e238620cfb69', '["*"]', '2026-03-05 01:59:05', NULL, '2026-03-03 20:42:15', '2026-03-05 01:59:05'),
	(41, 'App\\Models\\User', 7, 'api-token', 'e1e6a4e3d34c98b66297f931f3d65baee19795c0472c33648c7932dbf0212ac2', '["*"]', '2026-03-05 02:01:33', NULL, '2026-03-05 02:00:30', '2026-03-05 02:01:33'),
	(42, 'App\\Models\\User', 2, 'api-token', '4ee13e8129df3adc63b38baea3be88d5ea0001d960d073043507b4193f11b654', '["*"]', '2026-03-06 00:51:37', NULL, '2026-03-05 02:04:08', '2026-03-06 00:51:37'),
	(43, 'App\\Models\\User', 2, 'api-token', '9e334e0037d8b72c694410185a59f8a0992d919379ef3f2989be83a0c04ecd75', '["*"]', '2026-03-06 00:54:40', NULL, '2026-03-06 00:52:27', '2026-03-06 00:54:40'),
	(44, 'App\\Models\\User', 8, 'api-token', '28fa6c4a9d8016b6fcb6b181eed4abde4336580ee73f9ab7b06c6b9d269b677d', '["*"]', '2026-03-06 00:56:56', NULL, '2026-03-06 00:56:52', '2026-03-06 00:56:56'),
	(45, 'App\\Models\\User', 1, 'api-token', '74d5a768f9ef4ec3600e9c5567c21f55fab90a533e7e5224527d401c72fb6f71', '["*"]', '2026-03-16 00:19:49', NULL, '2026-03-06 00:57:36', '2026-03-16 00:19:49'),
	(46, 'App\\Models\\User', 1, 'api-token', 'af50ad414953c12cb3d7415d97072e5185ed741a9e571a9d56fa779cb78201dc', '["*"]', '2026-03-16 00:20:06', NULL, '2026-03-16 00:20:03', '2026-03-16 00:20:06'),
	(47, 'App\\Models\\User', 1, 'api-token', '4c04fb3182496ad0904d4638332385ad7bc1eff58ea0a4116becf7cab212e765', '["*"]', '2026-03-17 00:48:39', NULL, '2026-03-16 00:20:05', '2026-03-17 00:48:39'),
	(48, 'App\\Models\\User', 5, 'api-token', 'ae353b3270fb43bc398a75f31a6ca00171d4d0bfeadb7d80b0b92845b86f6802', '["*"]', '2026-03-17 00:56:43', NULL, '2026-03-17 00:56:40', '2026-03-17 00:56:43'),
	(49, 'App\\Models\\User', 5, 'api-token', '26bbcb616af30cdd1d0498214e452ab4b9b17f3a4a70baf87089ceb004113ec1', '["*"]', '2026-03-31 01:53:56', NULL, '2026-03-17 00:56:42', '2026-03-31 01:53:56'),
	(50, 'App\\Models\\User', 7, 'api-token', 'fab38a2a8c8c9a570c79bd3fd2ef9d9ee338d5c3e0a918fba6782966dd0cda51', '["*"]', '2026-03-17 20:41:50', NULL, '2026-03-17 20:41:47', '2026-03-17 20:41:50'),
	(51, 'App\\Models\\User', 7, 'api-token', 'c77da9a795ea6dd5798d5fbbe3ff75b300003806831c65f75ab9b900a33ef38b', '["*"]', '2026-03-27 01:36:59', NULL, '2026-03-17 20:41:49', '2026-03-27 01:36:59'),
	(52, 'App\\Models\\User', 2, 'api-token', '3ab78d5865484935f508a5139af88dec5d77ae9c435315766931d7bcbeefe1e2', '["*"]', '2026-03-18 00:38:11', NULL, '2026-03-18 00:38:08', '2026-03-18 00:38:11'),
	(53, 'App\\Models\\User', 2, 'api-token', 'f355b46d93b1a8c1ac34fd102a8c5ea6992b041fe0c718dffbc0f1c4b9edf197', '["*"]', '2026-03-18 00:38:21', NULL, '2026-03-18 00:38:10', '2026-03-18 00:38:21'),
	(54, 'App\\Models\\User', 1, 'api-token', '0753e68a9de7c767effe4e44cb2619989544a43c7a5db07d5648d7b1f31c534f', '["*"]', '2026-03-18 00:44:33', NULL, '2026-03-18 00:39:50', '2026-03-18 00:44:33'),
	(55, 'App\\Models\\User', 2, 'api-token', 'f33268cee0019bcd654963e258450e4e278eac11433db461ccfbe4449e3052b7', '["*"]', '2026-03-18 00:44:51', NULL, '2026-03-18 00:44:48', '2026-03-18 00:44:51'),
	(56, 'App\\Models\\User', 2, 'api-token', 'b0c9d2f0201bdf7ac701ba20eaabf537b3bc7fffa527e975a876c1b2e566f7ab', '["*"]', '2026-03-18 00:45:06', NULL, '2026-03-18 00:44:50', '2026-03-18 00:45:06'),
	(57, 'App\\Models\\User', 5, 'api-token', '4b53ab7c601052f9f67fa517dac943ca39f1449c1e74c6efae7e33267f532ce7', '["*"]', '2026-03-18 00:51:15', NULL, '2026-03-18 00:45:37', '2026-03-18 00:51:15'),
	(58, 'App\\Models\\User', 2, 'api-token', 'bd3439d88aa61de3f0f986eb321f53bde17aa279228e39cb4eea06bf98ac9b62', '["*"]', '2026-03-24 00:27:04', NULL, '2026-03-18 00:51:24', '2026-03-24 00:27:04'),
	(59, 'App\\Models\\User', 5, 'api-token', '4105fb2b03fcb3d66b583d6f37db25e55dc20e3c0482aca745bf210d80f727c6', '["*"]', '2026-03-25 18:49:29', NULL, '2026-03-24 00:28:30', '2026-03-25 18:49:29'),
	(60, 'App\\Models\\User', 8, 'api-token', 'ad37e8e1e2217178288ac4b942403216bbcd0db96d527abcca4456d862a1b33c', '["*"]', '2026-03-24 00:50:48', NULL, '2026-03-24 00:50:36', '2026-03-24 00:50:48'),
	(61, 'App\\Models\\User', 7, 'api-token', '8fedb5ccfcdc626e0d4c82aefb14ad32ca05c91488cb1dcf818549c668b63794', '["*"]', '2026-03-27 00:01:03', NULL, '2026-03-25 18:50:08', '2026-03-27 00:01:03'),
	(62, 'App\\Models\\User', 5, 'api-token', '75e1acef94dc38c314012a402a3fe561784bd8ecbe02f4869e7c8dc4e5d8578b', '["*"]', '2026-03-31 00:49:46', NULL, '2026-03-26 00:49:58', '2026-03-31 00:49:46'),
	(63, 'App\\Models\\User', 2, 'api-token', '6e6223e3d21c2be5625d0655b1a8d318883144364d479bd1650d2b6f6bbe4c94', '["*"]', '2026-03-27 00:01:28', NULL, '2026-03-27 00:01:25', '2026-03-27 00:01:28'),
	(64, 'App\\Models\\User', 2, 'api-token', '4d56c7240f874d14c48dbde4cf47dd7e431000a41edfd63d079841f0974896fa', '["*"]', NULL, NULL, '2026-03-27 00:01:26', '2026-03-27 00:01:26'),
	(65, 'App\\Models\\User', 2, 'api-token', 'c772eaeb96a591767e2bdae9fdd5d0e5ceacf7e1d390f0327db6235504d5115a', '["*"]', '2026-03-27 00:02:02', NULL, '2026-03-27 00:01:27', '2026-03-27 00:02:02'),
	(66, 'App\\Models\\User', 2, 'api-token', '4c010389fca4af1a328ac3073aed1d0736889ca9e40de86e5eddb87d4b776895', '["*"]', '2026-03-27 01:13:15', NULL, '2026-03-27 00:02:35', '2026-03-27 01:13:15'),
	(67, 'App\\Models\\User', 7, 'api-token', '82f8546736b7d665270e1e3bc3e2a912be85fdd472c3339ac749f23186b84665', '["*"]', '2026-03-27 01:14:57', NULL, '2026-03-27 01:14:13', '2026-03-27 01:14:57'),
	(68, 'App\\Models\\User', 8, 'api-token', '6f8ba8307edb608f80affc6d621e5e33fed2b5a82ab9a0a629f7ff79c00fdabd', '["*"]', '2026-03-27 01:27:20', NULL, '2026-03-27 01:15:09', '2026-03-27 01:27:20'),
	(69, 'App\\Models\\User', 2, 'api-token', '8f5ed8e3c6d1e079a749b74abc0e29fb813c7d3d7bfdf0f3eeedace68060574b', '["*"]', '2026-03-29 23:59:43', NULL, '2026-03-27 01:27:38', '2026-03-29 23:59:43'),
	(70, 'App\\Models\\User', 8, 'api-token', 'fc9882a3d3fbf162ac0c7abd7938bd90b57eb48e866240706f52c82fa7d32561', '["*"]', '2026-03-27 01:53:43', NULL, '2026-03-27 01:37:28', '2026-03-27 01:53:43'),
	(71, 'App\\Models\\User', 5, 'api-token', 'dbfa093792a0ca926d7d3a63e68637a7215449e1a79b1d39716ccb28e852fd56', '["*"]', '2026-03-31 00:02:14', NULL, '2026-03-29 23:54:27', '2026-03-31 00:02:14'),
	(72, 'App\\Models\\User', 5, 'api-token', '06cfef12f9ac245a16b89e67c0a26a2902f43eb9c88221b2b6cb688c6544a9be', '["*"]', '2026-03-30 01:05:10', NULL, '2026-03-29 23:59:56', '2026-03-30 01:05:10'),
	(73, 'App\\Models\\User', 2, 'api-token', 'cd98df450c43b4fed1eda8c7662d7872f523c8937358154fa029c16bbe22297e', '["*"]', '2026-05-05 00:42:10', NULL, '2026-03-30 01:05:19', '2026-05-05 00:42:10'),
	(74, 'App\\Models\\User', 5, 'api-token', 'deb8281e917187d0538fb1f4e417aaa5a2d4956009599409264f23beda5577dd', '["*"]', '2026-03-31 00:37:30', NULL, '2026-03-31 00:02:28', '2026-03-31 00:37:30'),
	(75, 'App\\Models\\User', 2, 'api-token', '8a0bdcfc8c5d13517ce334cb5b473b48f630b56328755ebdf5a4709809461041', '["*"]', '2026-03-31 02:38:01', NULL, '2026-03-31 00:37:40', '2026-03-31 02:38:01'),
	(76, 'App\\Models\\User', 2, 'api-token', '2aa020cbaec15a675da52fb6ea1ed26ed6b917213156be78eeaa1ac74f4b78e3', '["*"]', '2026-04-08 00:08:35', NULL, '2026-03-31 02:21:22', '2026-04-08 00:08:35'),
	(77, 'App\\Models\\User', 5, 'api-token', 'edcddece40a6d60d6a585c66aadf477f612e747d6512529ac2e509db2f678383', '["*"]', '2026-04-07 00:33:18', NULL, '2026-03-31 02:38:07', '2026-04-07 00:33:18'),
	(78, 'App\\Models\\User', 8, 'api-token', 'bf3394951206cf1f09154a6b02b17ffb6226c2b218c30a64b4182489f21508c1', '["*"]', '2026-04-15 19:39:20', NULL, '2026-04-07 00:33:37', '2026-04-15 19:39:20'),
	(79, 'App\\Models\\User', 2, 'api-token', '9b15805d55b247cac07e51516036c42f878c64e11bd11ddcf60fe61eab2dacb1', '["*"]', '2026-04-08 20:07:43', NULL, '2026-04-08 00:08:48', '2026-04-08 20:07:43'),
	(80, 'App\\Models\\User', 1, 'api-token', '259e633d8c7b9bcba419f298ed1b8aadc7022c4e7a90e1573011dbd4434a3463', '["*"]', '2026-04-08 20:08:32', NULL, '2026-04-08 20:08:30', '2026-04-08 20:08:32'),
	(81, 'App\\Models\\User', 1, 'api-token', '791a9fbfa135b32ecb0e0edef12946f6a1385a7ccd8fada898fe6e11a9ee0762', '["*"]', '2026-04-13 23:52:47', NULL, '2026-04-08 20:30:54', '2026-04-13 23:52:47'),
	(82, 'App\\Models\\User', 2, 'api-token', '0f489a1f34e2166f903bdfae887c9104846e96cc24923a6ef41afe4c21f31046', '["*"]', '2026-04-15 19:39:05', NULL, '2026-04-15 19:38:32', '2026-04-15 19:39:05'),
	(83, 'App\\Models\\User', 5, 'api-token', '53a2b8a1be644828e33532462877df5a2ce50f928216947a171d80d7d62599f1', '["*"]', '2026-04-19 23:39:24', NULL, '2026-04-15 19:39:42', '2026-04-19 23:39:24'),
	(84, 'App\\Models\\User', 1, 'api-token', 'e36b5c294a2a77d51ea210dd561ba3737151ff66bd0d5d18f7537f806674bf08', '["*"]', '2026-04-20 01:15:39', NULL, '2026-04-15 19:41:08', '2026-04-20 01:15:39'),
	(85, 'App\\Models\\User', 7, 'api-token', '10fda33b57d090e5d72c4de457ba51e75442396e334c98d3500df38e09dcf95a', '["*"]', '2026-04-20 20:31:09', NULL, '2026-04-19 23:39:37', '2026-04-20 20:31:09'),
	(86, 'App\\Models\\User', 1, 'api-token', 'b714f77a82da1c35dccfbfa82ac88517533e5cd560e36cb1a6ad6abb4ea78b4e', '["*"]', '2026-04-20 01:17:13', NULL, '2026-04-20 01:16:00', '2026-04-20 01:17:13'),
	(87, 'App\\Models\\User', 1, 'api-token', 'daead10d36eabf7ac1846a68ebfe95954cf846b033d77dd153509de5aedf342f', '["*"]', '2026-04-27 01:23:44', NULL, '2026-04-20 20:21:47', '2026-04-27 01:23:44'),
	(88, 'App\\Models\\User', 2, 'api-token', '7daa18f73eed3b73ac5724065317b953ccccbe8238e7d189be2064596d6da64a', '["*"]', '2026-05-04 18:42:41', NULL, '2026-04-20 20:31:19', '2026-05-04 18:42:41'),
	(89, 'App\\Models\\User', 8, 'api-token', 'ad56e5d8476f2fed4a7d7c513dd4b16102c96c91d4b8072c0c96d6f196d18d39', '["*"]', '2026-05-05 00:19:14', NULL, '2026-04-21 00:25:12', '2026-05-05 00:19:14'),
	(90, 'App\\Models\\User', 2, 'api-token', '3661cc86159bc83c78d5f2705c760e40fe4a56a75ee526f70b260e3462ac8d73', '["*"]', '2026-05-05 19:33:19', NULL, '2026-04-27 01:23:52', '2026-05-05 19:33:19'),
	(91, 'App\\Models\\User', 8, 'api-token', '9aaf272ce9f24f621d85c5b6a5c91b7ab773ac5c50277e63bd4757c1f4c4265d', '["*"]', '2026-05-04 18:43:12', NULL, '2026-05-04 18:42:57', '2026-05-04 18:43:12'),
	(92, 'App\\Models\\User', 1, 'api-token', '6a73482f1d7662970aad3b988e41cf336f94ec051d378daa39d4e26e8694d2fd', '["*"]', '2026-05-05 18:31:42', NULL, '2026-05-05 00:19:23', '2026-05-05 18:31:42'),
	(93, 'App\\Models\\User', 5, 'api-token', '1f4b63a4e3256c5649941abe9718ab289244e273988170d486db3867d49878ee', '["*"]', '2026-05-05 00:45:07', NULL, '2026-05-05 00:35:19', '2026-05-05 00:45:07'),
	(94, 'App\\Models\\User', 1, 'api-token', '1a1020ac73791f0f04751483164e9091c4851f11d3034ee645851b31dd54b3bb', '["*"]', '2026-05-05 19:06:59', NULL, '2026-05-05 18:32:00', '2026-05-05 19:06:59'),
	(95, 'App\\Models\\User', 1, 'api-token', '809d21d3cf9e01a86d81cc28b5265c760c64f47375aed769728cbbdf600369ff', '["*"]', '2026-05-07 00:31:47', NULL, '2026-05-05 19:34:10', '2026-05-07 00:31:47'),
	(96, 'App\\Models\\User', 2, 'api-token', '899b19fd770dcaa0149aa3f42765c8fc419ca8096fd33960de3e14606992b58f', '["*"]', '2026-05-05 19:41:52', NULL, '2026-05-05 19:34:31', '2026-05-05 19:41:52'),
	(97, 'App\\Models\\User', 2, 'api-token', '6d25f4b1b3549ac4327e7e447172dc6972cda5da4a445334be6c69bdcd8556a0', '["*"]', '2026-05-05 19:44:18', NULL, '2026-05-05 19:42:00', '2026-05-05 19:44:18'),
	(98, 'App\\Models\\User', 5, 'api-token', '707af2f4e31869ca63e0344a7409f09ccffcbfc4e8a8581bf59c6dd91394416a', '["*"]', '2026-05-05 19:43:50', NULL, '2026-05-05 19:43:43', '2026-05-05 19:43:50'),
	(99, 'App\\Models\\User', 2, 'api-token', '721ebc0c85d070efdf0142751028501c354376916f7c0733e4cc8b5809715adf', '["*"]', '2026-05-05 19:45:01', NULL, '2026-05-05 19:44:38', '2026-05-05 19:45:01'),
	(100, 'App\\Models\\User', 5, 'api-token', '68548bf28a8c5d36ad83b70cf39f433a08f5fa7e464286c11af5a3f3d3f46420', '["*"]', '2026-05-19 21:51:45', NULL, '2026-05-05 19:45:19', '2026-05-19 21:51:45'),
	(101, 'App\\Models\\User', 1, 'api-token', '0e22fde3ca4d765c83c70efb4c3e368bad4f9317e811d7305f5f671be56fde65', '["*"]', '2026-05-11 19:36:45', NULL, '2026-05-07 00:31:47', '2026-05-11 19:36:45'),
	(102, 'App\\Models\\User', 1, 'api-token', '774b698625a696c0875450d26cc4408ab054964bdba4b928de39e349a95d72b3', '["*"]', '2026-05-11 19:37:11', NULL, '2026-05-11 19:37:08', '2026-05-11 19:37:11'),
	(103, 'App\\Models\\User', 1, 'api-token', '150b8cbe267790da88f084b622cdf240eb9bf8fce7ffdc9d1dbba3b74f81894e', '["*"]', '2026-05-17 20:30:55', NULL, '2026-05-11 19:43:29', '2026-05-17 20:30:55'),
	(104, 'App\\Models\\User', 1, 'api-token', '68ed223cdd0dd048c798aa51252ff1993abbfd4307d2fc4bdd4d176b37bae439', '["*"]', '2026-05-24 21:30:11', NULL, '2026-05-17 20:30:54', '2026-05-24 21:30:11'),
	(105, 'App\\Models\\User', 2, 'api-token', '4aa94549faf342ece695bef6fd3c063f96f066edec60c1b376e0e827c339dbb9', '["*"]', '2026-05-19 19:56:00', NULL, '2026-05-18 01:04:11', '2026-05-19 19:56:00'),
	(106, 'App\\Models\\User', 7, 'api-token', '351838662ff6113d781ddcf0421db79b74fdaf7bb1a3fff5def9682c62260aa3', '["*"]', '2026-05-19 21:29:09', NULL, '2026-05-19 20:52:41', '2026-05-19 21:29:09'),
	(107, 'App\\Models\\User', 2, 'api-token', 'c13c9868d0793cf8f9872fe0de0ad75a6c047b64f410aa874893a55acdde92fb', '["*"]', '2026-05-20 20:32:16', NULL, '2026-05-19 21:36:53', '2026-05-20 20:32:16'),
	(108, 'App\\Models\\User', 10, 'api-token', '67a05ab425c1c178ecbab2a77b77be5d7cc45c5f7b0860fd47f0e93984baffc4', '["*"]', '2026-05-19 22:05:33', NULL, '2026-05-19 21:51:57', '2026-05-19 22:05:33'),
	(109, 'App\\Models\\User', 12, 'api-token', 'df2d345ba10dd7674b32c307e7dc731c9ef1be0768bae31d9754291e3e470075', '["*"]', '2026-05-24 21:30:12', NULL, '2026-05-20 01:25:53', '2026-05-24 21:30:12'),
	(110, 'App\\Models\\User', 2, 'api-token', '63aff33b32f26d9efb72980d41e2ed66221ec082df2e86beaec400631dea6556', '["*"]', '2026-05-24 20:14:41', NULL, '2026-05-20 20:32:34', '2026-05-24 20:14:41'),
	(111, 'App\\Models\\User', 2, 'api-token', 'df2fc991da79162db03c5588aec38a4e554a8b069c615e209bfc4b1b70090901', '["*"]', '2026-05-24 20:05:10', NULL, '2026-05-24 20:04:58', '2026-05-24 20:05:10'),
	(112, 'App\\Models\\User', 2, 'api-token', '6ec2835572d504cc30466828836aba7fb047cd92437f8614b68703db7e6f8698', '["*"]', '2026-05-24 21:30:11', NULL, '2026-05-24 21:09:59', '2026-05-24 21:30:11'),
	(113, 'App\\Models\\User', 1, 'api-token', 'ee10de2a2a50eed8eced21d5a5af73244ac64cbe2cc01bf96a33bb4876f8730a', '["*"]', '2026-06-08 01:05:37', NULL, '2026-06-04 01:15:34', '2026-06-08 01:05:37'),
	(114, 'App\\Models\\User', 1, 'api-token', '5185315a05fa89eec5a9676cac7617773352432ebb19077cf12c5875f985380b', '["*"]', '2026-06-08 01:54:09', NULL, '2026-06-08 01:05:36', '2026-06-08 01:54:09');
INSERT INTO "positions" ("id", "name", "created_at", "updated_at") VALUES
	(1, 'Staff', NULL, NULL),
	(2, 'Guru', NULL, NULL),
	(3, 'Kepala Unit', NULL, NULL),
	(4, 'Kepala Department', NULL, NULL),
	(5, 'Koordinator', NULL, NULL),
	(6, 'PIC', NULL, NULL),
	(7, 'ASV', NULL, NULL);
INSERT INTO "roles" ("id", "name", "guard_name", "created_at", "updated_at") VALUES
	(1, 'superadmin', 'sanctum', '2026-02-09 01:25:29', '2026-02-09 23:47:31'),
	(2, 'admin', 'sanctum', '2026-02-09 01:25:29', '2026-02-09 23:47:31'),
	(3, 'user', 'sanctum', '2026-02-09 01:25:29', '2026-02-09 23:47:31'),
	(4, 'kepala_unit', 'sanctum', '2026-02-09 01:25:29', '2026-02-09 23:47:31'),
	(5, 'kepala_department', 'sanctum', '2026-02-09 01:25:29', '2026-02-09 23:47:31'),
	(6, 'pic', 'sanctum', '2026-02-09 01:25:29', '2026-02-09 23:47:31'),
	(7, 'koordinator', 'sanctum', '2026-02-09 01:25:29', '2026-02-09 23:47:31'),
	(8, 'asv', 'sanctum', '2026-02-09 01:25:29', '2026-02-09 23:47:31');
INSERT INTO "role_has_permissions" ("permission_id", "role_id") VALUES
	(1, 1),
	(2, 1),
	(3, 1),
	(4, 1),
	(5, 1),
	(6, 1),
	(7, 1),
	(8, 1),
	(1, 2),
	(2, 2),
	(6, 2),
	(3, 3),
	(3, 4),
	(4, 4),
	(3, 5),
	(4, 5),
	(5, 5),
	(4, 6),
	(8, 6),
	(1, 7),
	(2, 7),
	(5, 7),
	(6, 7),
	(7, 7);
INSERT INTO "tickets" ("id", "ticket_code", "title", "description", "department_id", "ticket_category_id", "created_by", "unit_id", "current_status", "current_approver_id", "pic_id", "priority", "due_date", "closed_at", "created_at", "updated_at") VALUES
	(1, 'TCK-A9CTQL', 'Laptop tidak bisa menyala', 'Laptop mati total sejak pagi', 1, 1, 1, 13, 'waiting_unit_approval', 5, NULL, '', NULL, NULL, '2026-02-09 19:32:44', '2026-02-09 19:32:44'),
	(2, 'TCK-MR7AJK', 'Laptop tidak bisa menyala', 'Laptop mati total sejak pagi', 3, 2, 1, 13, 'in_progress', 8, 8, 'medium', NULL, NULL, '2026-02-09 19:42:32', '2026-04-08 00:26:35'),
	(3, 'TCK-WTEGUA', 'Laptop tidak bisa menyala', 'Laptop mati total sejak pagi', 3, 2, 7, 12, 'completed', NULL, 8, 'medium', NULL, '2026-02-24 02:08:47', '2026-02-09 23:45:59', '2026-02-24 02:08:47'),
	(4, 'TCK-RWOEXL', 'Laptop tidak bisa menyala', 'Laptop mati total sejak pagi', 3, 2, 7, 12, 'completed', NULL, 8, 'medium', NULL, NULL, '2026-02-09 23:48:24', '2026-02-24 01:41:02'),
	(5, 'TCK-A3AYF6', 'Buat Banner untuk acara ulangtahun sekolah', 'buatkan banner ukuran 5x2 untuk acara ulang tahun SMA IBC', 3, 3, 7, 12, 'completed', NULL, 8, 'medium', NULL, '2026-02-24 01:43:45', '2026-02-10 18:47:02', '2026-02-24 01:43:45'),
	(6, 'TCK-YRR8JM', 'Buat Banner untuk acara ulangtahun sekolah', 'buatkan banner ukuran 5x2 untuk acara ulang tahun SMA IBC', 3, 3, 7, 12, 'completed', NULL, 8, 'medium', NULL, '2026-04-08 00:01:02', '2026-02-10 23:57:20', '2026-04-08 00:01:02'),
	(7, 'TCK-QNIJKR', 'dawdawda', 'dadadw', 3, 2, 7, 12, 'waiting_pic_assigned', 2, NULL, '', NULL, NULL, '2026-03-05 02:00:54', '2026-03-27 01:36:13'),
	(8, 'TCK-WWCTIY', 'ticket', 'adadaawdadafasdawdwa', 3, 2, 7, 12, 'waiting_pic_assigned', 2, NULL, '', NULL, NULL, '2026-03-17 20:42:33', '2026-03-27 00:38:08'),
	(9, 'TCK-G5SW7J', 'wdadawda', 'wdawdassdgdfafrf', 3, 2, 7, 12, 'in_progress', 8, 8, 'high', '2026-05-06', NULL, '2026-03-25 18:50:28', '2026-04-29 00:25:08'),
	(10, 'TCK-DZKHOM', 'dadadawawda', 'adawdawdawdd', 4, 4, 7, 12, 'waiting_unit_approval', 5, NULL, '', NULL, NULL, '2026-03-25 20:35:15', '2026-03-25 20:35:15'),
	(11, 'TCK-5OMDDY', 'wdadadwdawda', 'adawdaddadddw', 3, 2, 5, 12, 'completed', NULL, 8, 'medium', NULL, '2026-04-08 00:07:54', '2026-03-30 01:04:02', '2026-04-08 00:07:54'),
	(12, 'TCK-0MTR1R', 'wdadwada', 'adadaafasfafawfaawdawd', 3, 3, 2, 13, 'waiting_department_review', 2, 8, 'medium', NULL, NULL, '2026-03-30 01:14:06', '2026-04-21 00:26:03'),
	(13, 'TCK-SBRI2S', 'pembuatan ticket', 'testing pembuatan ticket', 3, 2, 5, 12, 'in_progress', 8, 8, 'medium', '2026-05-07', NULL, '2026-04-15 19:40:31', '2026-04-30 00:25:56'),
	(14, 'TCK-BGUU6D', 'pembuatan konten ski', 'wdasdadawawd', 3, 2, 2, NULL, 'waiting_pic_assigned', 2, NULL, NULL, NULL, NULL, '2026-05-04 20:28:39', '2026-05-04 20:28:39'),
	(15, 'TCK-6JWQI3', 'permintaan pembuatan poster pelepasan siswa', 'desain poster perpisahan', 3, 3, 5, NULL, 'waiting_department_approval', 2, NULL, NULL, NULL, NULL, '2026-05-05 19:46:58', '2026-05-05 19:46:58'),
	(16, 'TCK-SHLIVT', 'permintaan printer baru', 'perlu printer baru untuk tu sma ibc', 4, 4, 5, 12, 'waiting_department_approval', NULL, NULL, NULL, NULL, NULL, '2026-05-05 19:56:08', '2026-05-05 19:56:08'),
	(17, 'TCK-NOECHQ', 'beli ac baruu', 'pembelian ac baru untuk 2 kelas', 4, 4, 5, 12, 'waiting_department_approval', NULL, NULL, NULL, NULL, NULL, '2026-05-05 20:11:42', '2026-05-05 20:11:42'),
	(18, 'TCK-EEBEWT', 'contoh', 'tes tes', 4, 2, 5, 12, 'in_progress', 11, 11, 'medium', '2026-05-22', NULL, '2026-05-05 20:17:32', '2026-05-19 22:05:30'),
	(19, 'TCK-66X2L8', 'perbaikann komputer', 'perbaikan pc komputer staf auditor ISO', 3, 2, 12, 13, 'waiting_unit_approval', 1, NULL, NULL, NULL, NULL, '2026-05-24 20:13:31', '2026-05-24 20:13:31');
INSERT INTO "ticket_approvals" ("id", "ticket_id", "approved_by", "role_as", "status", "notes", "approved_at", "created_at", "updated_at") VALUES
	(1, 5, 5, 'kepala_unit', 'approved', 'Disetujui kepala unit', '2026-02-11 00:01:06', '2026-02-11 00:01:06', '2026-02-11 00:01:06'),
	(2, 6, 5, 'kepala_unit', 'approved', 'Disetujui kepala unit', '2026-02-11 00:07:01', '2026-02-11 00:07:01', '2026-02-11 00:07:01'),
	(3, 5, 2, 'kepala_department', 'approved', 'Disetujui kepala Department', '2026-02-11 00:26:36', '2026-02-11 00:26:36', '2026-02-11 00:26:36'),
	(4, 6, 2, 'kepala_department', 'approved', 'Disetujui kepala Department', '2026-02-22 20:59:26', '2026-02-22 20:59:26', '2026-02-22 20:59:26'),
	(5, 4, 2, 'kepala_unit', 'approved', 'Disetujui kepala unit', '2026-02-23 20:37:55', '2026-02-23 20:37:55', '2026-02-23 20:37:55'),
	(6, 4, 2, 'kepala_department', 'approved', 'Disetujui kepala Department', '2026-02-23 20:38:35', '2026-02-23 20:38:35', '2026-02-23 20:38:35'),
	(7, 3, 5, 'kepala_unit', 'approved', 'Disetujui kepala Department', '2026-02-24 01:51:34', '2026-02-24 01:51:34', '2026-02-24 01:51:34'),
	(8, 3, 2, 'kepala_department', 'approved', 'Disetujui kepala Department', '2026-02-24 01:52:02', '2026-02-24 01:52:02', '2026-02-24 01:52:02'),
	(9, 3, 2, 'kepala_department', 'assigned_pic', 'PIC assigned to user ID: 8', '2026-02-24 02:07:50', '2026-02-24 02:07:50', '2026-02-24 02:07:50'),
	(10, 3, 8, 'pic', 'submitted', NULL, '2026-02-24 02:08:29', '2026-02-24 02:08:29', '2026-02-24 02:08:29'),
	(11, 3, 2, 'kepala_department', 'approved', NULL, '2026-02-24 02:08:47', '2026-02-24 02:08:47', '2026-02-24 02:08:47'),
	(12, 8, 5, 'kepala_unit', 'approved', NULL, '2026-03-17 20:52:26', '2026-03-17 20:52:26', '2026-03-17 20:52:26'),
	(13, 7, 5, 'kepala_unit', 'approved', NULL, '2026-03-24 00:28:41', '2026-03-24 00:28:41', '2026-03-24 00:28:41'),
	(14, 8, 2, 'kepala_department', 'approved', NULL, '2026-03-27 00:38:08', '2026-03-27 00:38:08', '2026-03-27 00:38:08'),
	(15, 7, 2, 'kepala_department', 'approved', NULL, '2026-03-27 01:36:13', '2026-03-27 01:36:13', '2026-03-27 01:36:13'),
	(24, 11, 2, 'kepala_department', 'approved', NULL, '2026-03-31 00:10:29', '2026-03-31 00:10:29', '2026-03-31 00:10:29'),
	(25, 12, 2, 'kepala_department', 'assigned_pic', 'PIC assigned to user ID: 8', '2026-03-31 01:05:08', '2026-03-31 01:05:08', '2026-03-31 01:05:08'),
	(26, 9, 5, 'kepala_unit', 'approved', NULL, '2026-03-31 02:38:27', '2026-03-31 02:38:27', '2026-03-31 02:38:27'),
	(27, 11, 2, 'kepala_department', 'assigned_pic', 'PIC assigned to user ID: 8', '2026-04-01 00:12:56', '2026-04-01 00:12:56', '2026-04-01 00:12:56'),
	(28, 9, 2, 'kepala_department', 'approved', NULL, '2026-04-01 00:14:04', '2026-04-01 00:14:04', '2026-04-01 00:14:04'),
	(31, 2, 5, 'kepala_unit', 'approved', NULL, '2026-04-01 00:45:43', '2026-04-01 00:45:43', '2026-04-01 00:45:43'),
	(32, 2, 2, 'kepala_department', 'approved', NULL, '2026-04-01 00:46:10', '2026-04-01 00:46:10', '2026-04-01 00:46:10'),
	(33, 6, 8, 'pic', 'submitted', NULL, '2026-04-07 02:22:36', '2026-04-07 02:22:36', '2026-04-07 02:22:36'),
	(34, 11, 8, 'pic', 'submitted', NULL, '2026-04-07 23:45:17', '2026-04-07 23:45:17', '2026-04-07 23:45:17'),
	(35, 6, 2, 'kepala_department', 'approved', NULL, '2026-04-08 00:01:02', '2026-04-08 00:01:02', '2026-04-08 00:01:02'),
	(36, 11, 2, 'kepala_department', 'approved', 'nicee', '2026-04-08 00:07:54', '2026-04-08 00:07:54', '2026-04-08 00:07:54'),
	(37, 2, 2, 'kepala_department', 'assigned_pic', 'PIC assigned to user ID: 8', '2026-04-08 00:26:35', '2026-04-08 00:26:35', '2026-04-08 00:26:35'),
	(38, 12, 8, 'pic', 'submitted', NULL, '2026-04-21 00:26:03', '2026-04-21 00:26:03', '2026-04-21 00:26:03'),
	(39, 9, 2, 'kepala_department', 'pic_assigned', 'kerjakan secepatnya', '2026-04-29 00:25:08', '2026-04-29 00:25:08', '2026-04-29 00:25:08'),
	(40, 13, 2, 'kepala_department', 'department_approved', 'lanjut', '2026-04-29 00:29:56', '2026-04-29 00:29:56', '2026-04-29 00:29:56'),
	(41, 13, 2, 'kepala_department', 'department_approved', 'gas lanjut', '2026-04-29 00:31:29', '2026-04-29 00:31:29', '2026-04-29 00:31:29'),
	(42, 13, 2, 'kepala_department', 'pic_assigned', 'kerjakan secepatnya', '2026-04-30 00:25:56', '2026-04-30 00:25:56', '2026-04-30 00:25:56'),
	(47, 18, 2, 'kepala_department', 'forwarded', 'perlu pengajuan', '2026-05-19 21:44:08', '2026-05-19 21:44:08', '2026-05-19 21:44:08'),
	(48, 18, 10, 'kepala_department', 'forwarded', 'balikin', '2026-05-19 21:52:18', '2026-05-19 21:52:18', '2026-05-19 21:52:18'),
	(49, 18, 2, 'kepala_department', 'forwarded', 'kembalikan lagi hehe', '2026-05-19 21:54:32', '2026-05-19 21:54:32', '2026-05-19 21:54:32'),
	(50, 18, 10, 'kepala_department', 'department_approved', NULL, '2026-05-19 22:05:16', '2026-05-19 22:05:16', '2026-05-19 22:05:16'),
	(51, 18, 10, 'kepala_department', 'pic_assigned', 'kerja ryan', '2026-05-19 22:05:30', '2026-05-19 22:05:30', '2026-05-19 22:05:30');
INSERT INTO "ticket_attachments" ("id", "ticket_id", "file_path", "file_name", "mime_type", "uploaded_by", "stage", "created_at", "updated_at", "deleted_at") VALUES
	(1, 5, 'tickets/5/m0MTYY3OUQYAO5ipCTtJb3R9W5WH4CchHONd7L6S.docx', 'Jadwal Devosi Pagi Maret.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 8, 'initial', '2026-02-26 00:14:04', '2026-02-26 00:14:04', NULL),
	(2, 6, 'tickets/6/6qHu43iVQoBGyAxN120yyegcfYbvlYfsVZwy8HHS.docx', 'Jadwal Devosi Pagi Maret.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 8, 'initial', '2026-02-26 00:18:12', '2026-02-26 00:18:12', NULL),
	(3, 5, 'tickets/5/U6dJ5R26AuOKZQ9S75YJs9B509Vqe441Lx4wM660.jpg', 'WhatsApp Image 2026-01-23 at 13.10.53.jpeg', 'image/jpeg', 8, 'initial', '2026-02-26 00:50:44', '2026-02-26 00:52:56', '2026-02-26 00:52:56'),
	(4, 5, 'tickets/5/1zNQLsYVTlGsiTE4aDoAtQyVAJg54yRJVxJF465h.jpg', 'WhatsApp Image 2026-01-23 at 13.10.53.jpeg', 'image/jpeg', 8, 'initial', '2026-02-26 00:50:54', '2026-02-26 00:50:54', NULL),
	(5, 5, 'tickets/5/1oXpdf8ZIy8777iP6XADFUuDLHpZoSC4Ak5mwamn.pdf', '2026_01_22 15.37 Office Lens.pdf', 'application/pdf', 8, 'initial', '2026-02-26 00:51:26', '2026-02-26 00:51:26', NULL),
	(6, 8, 'tickets/8/jh6W93LXi4LWXwKEP2bTmJyJBu90BiBIPRqc0xLt.docx', 'Rev2-POS-TIK-004 Standarisasi Perangkat TI - Copy.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 7, 'initial', '2026-03-17 20:42:35', '2026-03-17 20:42:35', NULL),
	(7, 9, 'tickets/9/SyzvMBAv53TnR0KM9pZ12xj2hzZkoogIhM4GZBhA.pdf', 'SP_Tugas_P03.pdf', 'application/pdf', 7, 'initial', '2026-03-25 18:50:30', '2026-03-25 18:50:30', NULL),
	(8, 10, 'tickets/10/twmteeIZ8C5n2KxlY1Q0u3Ehgp6QlbiExMAgVYdG.pdf', 'Rundown Gladi Ibadah Paskah ITBSS 2026.pdf', 'application/pdf', 7, 'initial', '2026-03-25 20:35:16', '2026-03-25 20:35:16', NULL),
	(9, 12, 'tickets/12/AsurJgMO6OdHnJEs88m4yGAh9Og5Wirj3nrVBFO9.docx', 'Jadwal Devosi Pagi April.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 2, 'initial', '2026-03-30 01:14:08', '2026-03-30 01:14:08', NULL),
	(10, 6, 'tickets/6/HFcfPFqq0Ch8qY6xEU3UjDgxb2GBPxms9aTWngdX.docx', 'Jadwal Devosi Pagi April.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 8, 'initial', '2026-04-07 02:22:36', '2026-04-07 02:22:36', NULL),
	(11, 11, 'tickets/11/BXkMMKbV0d3GGu8HsDaFUkrZO9HXcbvtp2ht8KrB.pdf', 'Rundown Gladi Ibadah Paskah ITBSS 2026 (1).pdf', 'application/pdf', 8, 'initial', '2026-04-07 23:45:17', '2026-04-07 23:45:17', NULL),
	(12, 13, 'tickets/13/XI21GxIE9ouVRCZuJhg8Uhn28THc9fc38jSEkRgi.png', '700-Steven Edmund Pratama (1).png', 'image/png', 5, 'initial', '2026-04-15 19:40:32', '2026-04-15 19:40:32', NULL),
	(13, 12, 'tickets/12/njBYrbLdVMZO8mXIR2btJV6yOyElwyEpSh3OzYun.pdf', 'git-cheat-sheet-education.pdf', 'application/pdf', 8, 'initial', '2026-04-21 00:26:03', '2026-04-21 00:26:03', NULL),
	(14, 15, 'tickets/15/rqBdZvdmFj0JxCGxxbrtfuHX3RZV2Stk3GKakGM5.docx', 'Tutorial_Dasar_Gitar.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 5, 'initial', '2026-05-05 19:47:00', '2026-05-05 19:47:00', NULL),
	(15, 18, 'tickets/18/zANbbL9Frh4hEZRAJH9tp2blHM2LFWUbLKtNJrCu.docx', 'Tutorial_Dasar_Gitar.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 5, 'initial', '2026-05-05 20:17:33', '2026-05-05 20:17:33', NULL),
	(16, 18, 'tickets/18/fdaBWPzCy9m91AVwhWy2a2bsB8yVVSC8rltpe4rf.docx', 'Panduan Belajar Famili Chord.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 5, 'initial', '2026-05-05 20:17:33', '2026-05-05 20:17:33', NULL),
	(17, 19, 'tickets/19/LNZxtmXu1hbYi5rueDLWGkjfgNqIrYn2l93GQOO1.docx', 'CV_Steven_Edmund_Pratama.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 12, 'initial', '2026-05-24 20:13:33', '2026-05-24 20:13:33', NULL),
	(18, 19, 'tickets/19/JvmyhB4UQv5zCZEk7PIjskuQbZMGqVzDbbzDAFaT.docx', 'Bab2_Bab3_Penelitian_Burnout.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 12, 'initial', '2026-05-24 20:13:34', '2026-05-24 20:13:34', NULL),
	(19, 19, 'tickets/19/gMCZACGK8xMk6R907Ij40HWRfKZkVsSziGPtHE4I.docx', 'Bab 2.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 12, 'initial', '2026-05-24 20:13:34', '2026-05-24 20:13:34', NULL),
	(20, 19, 'tickets/19/wO9zlptuHxHnInfVIa0b5YMFzu30Q60Cc4xBvwbJ.pdf', 'SARMUT_ISO21001_TI_2026.PDF', 'application/pdf', 12, 'initial', '2026-05-24 20:13:34', '2026-05-24 20:13:34', NULL),
	(21, 19, 'tickets/19/TXFs8VZqlA7VqTA5budkdBo5ibmsIqx1Igead1gb.pdf', 'fpsyg-14-1133706 (1).pdf', 'application/pdf', 12, 'initial', '2026-05-24 20:13:35', '2026-05-24 20:13:35', NULL);
INSERT INTO "ticket_categories" ("id", "code", "name", "department_id", "description", "is_active", "created_at", "updated_at") VALUES
	(1, 'UMUM', 'Pengajuan Umum', 7, 'Pengajuan umum lintas department', true, '2026-02-09 01:28:08', '2026-04-16 00:58:49'),
	(2, 'POS-TIK-002', 'Form Perbaikan Jaringan dan Perangkat TI', 3, 'Perbaikan perangkat komputer dan laptop', true, NULL, '2026-04-16 00:58:23'),
	(3, 'POS-TIK-003', 'Form Permintaan Desain Grafis', 3, 'Permintaan desain grafis untuk kebutuhan internal', true, NULL, NULL),
	(4, 'POS-SPR-010', 'Pengajuan Barang/Jasa Non rutin', 4, 'Pengajuan pembelian barang non rutin', true, NULL, NULL);
INSERT INTO "ticket_forward_histories" ("id", "ticket_id", "from_department_id", "to_department_id", "forwarded_by", "notes", "forwarded_at") VALUES
	(2, 18, 3, 4, 2, 'perlu pengajuan', '2026-05-19 21:44:08'),
	(3, 18, 4, 3, 10, 'balikin', '2026-05-19 21:52:18'),
	(4, 18, 3, 4, 2, 'kembalikan lagi hehe', '2026-05-19 21:54:32');
INSERT INTO "units" ("id", "name", "head_id", "created_at", "updated_at") VALUES
	(1, 'TK1', NULL, NULL, NULL),
	(2, 'TK2', NULL, NULL, NULL),
	(3, 'SD1', NULL, NULL, NULL),
	(4, 'SD2', NULL, NULL, NULL),
	(5, 'SMP1', NULL, NULL, NULL),
	(6, 'SMP2', NULL, NULL, NULL),
	(7, 'SMK1', NULL, NULL, NULL),
	(8, 'SMK2', NULL, NULL, NULL),
	(9, 'SMA Reguler', NULL, NULL, NULL),
	(10, 'SD IBC', NULL, NULL, NULL),
	(11, 'SMP IBC', NULL, NULL, NULL),
	(12, 'SMA IBC', 5, NULL, NULL),
	(13, 'YGPKB', 1, NULL, NULL);
INSERT INTO "users" ("id", "unit_id", "department_id", "position_id", "name", "email", "email_verified_at", "password", "remember_token", "created_at", "updated_at") VALUES
	(1, 13, NULL, NULL, 'Steven Edmund', 'steven_e@ski.sch.id', NULL, '$2y$12$6UBmNWu4YA6k0jmnYOjiw.QwLij8zgywUnILZshnf9hUsJt16Yi9a', NULL, '2026-02-09 01:25:30', '2026-05-20 01:21:25'),
	(2, 13, 3, 4, 'Stefanus', 'stefanus@ski.sch.id', NULL, '$2y$12$MDukdByMQn8L6eJTLppFpeL2sAEOjM5x.K1.EeARaC6YliZGkH9Vu', NULL, '2026-02-10 00:09:18', '2026-02-10 00:09:18'),
	(5, 12, 8, 3, 'Siaw Leng', 'siawleng@ski.sch.id', NULL, '$2y$12$.So5pjNP.xJAay.NFfjeFuUpoK0wwZ22leV3QTi/zZ7sEQ7GI9f7y', NULL, '2026-02-10 18:30:23', '2026-02-10 18:30:23'),
	(7, 12, 8, 2, 'Dhavid Bhertus', 'dhavid_b@ski.sch.id', NULL, '$2y$12$KjoQWiRUsoQCBZCxTF74/euaBaJ64dxbawXB2D4T88DhgaBOYY/RS', NULL, '2026-02-10 18:42:31', '2026-02-10 18:42:31'),
	(8, 13, 3, 1, 'Jose Mario Hendra', 'jose_m@ski.sch.id', NULL, '$2y$12$EdRspwOZXJ6/F7lT0gZDXOjmGwEzNVH6V2J5wWTF1uEzJfbX77ffi', NULL, '2026-02-22 19:32:58', '2026-02-22 19:32:58'),
	(9, 7, 8, 3, 'Hui Hui', 'huihui@ski.sch.id', NULL, '$2y$12$jsVV9WE0zPCpci7qI5GPreS9yPqpO0.ormslIQJICr6Wo2kutcLue', NULL, '2026-05-07 01:01:05', '2026-05-20 01:17:02'),
	(10, 13, 4, 4, 'Benny', 'benny.wugo@ski.sch.id', NULL, '$2y$12$VHcI5yg1wxOiHq/t7e8uBOZLlt6CzwjzvMEZzQ5hUUI693CSCfDGK', NULL, '2026-05-19 21:41:46', '2026-05-20 01:16:42'),
	(11, 13, 4, 1, 'Ryan Febrianto', 'ryan_f@ski.sch.id', NULL, '$2y$12$f4Wpdt4i0bYneHfnqXogJ.QyBr2MxjWPvpndUz/Mmj8vahSGOPEgS', NULL, '2026-05-19 22:04:57', '2026-05-20 01:16:29'),
	(12, 13, 3, 1, 'KelioXenelly', 'kelio_x@ski.sch.id', NULL, '$2y$12$3GRzlqgJ.aa7Od0ivindW.CTW3PVtWI8WQMp8sQV15RokaMlLcgbu', NULL, '2026-05-20 01:25:29', '2026-05-20 01:25:29'),
	(13, 7, 8, 3, 'steven edmund', 'stevenedmund18@gmail.com', NULL, '$2y$12$UXwMBVruG6ZhtOjD0BFUjeG7EawioT8aiaZneqptiKUQREMH35Uhe', NULL, '2026-06-04 01:22:59', '2026-06-04 01:22:59'),
	(14, 7, 8, 1, 'steven amud', 'stevenamud51@gmail.com', NULL, '$2y$12$2/kq3IgsiLAiBsuMhfGJ0uSMCE9XUIbemc/XdCcDu/CUoK6mPC9Nq', NULL, '2026-06-04 01:23:30', '2026-06-04 01:23:30');

SELECT setval(pg_get_serial_sequence('departments', 'id'), COALESCE((SELECT MAX("id") FROM "departments"), 1), (SELECT MAX("id") IS NOT NULL FROM "departments"));
SELECT setval(pg_get_serial_sequence('failed_jobs', 'id'), COALESCE((SELECT MAX("id") FROM "failed_jobs"), 1), (SELECT MAX("id") IS NOT NULL FROM "failed_jobs"));
SELECT setval(pg_get_serial_sequence('migrations', 'id'), COALESCE((SELECT MAX("id") FROM "migrations"), 1), (SELECT MAX("id") IS NOT NULL FROM "migrations"));
SELECT setval(pg_get_serial_sequence('permissions', 'id'), COALESCE((SELECT MAX("id") FROM "permissions"), 1), (SELECT MAX("id") IS NOT NULL FROM "permissions"));
SELECT setval(pg_get_serial_sequence('personal_access_tokens', 'id'), COALESCE((SELECT MAX("id") FROM "personal_access_tokens"), 1), (SELECT MAX("id") IS NOT NULL FROM "personal_access_tokens"));
SELECT setval(pg_get_serial_sequence('positions', 'id'), COALESCE((SELECT MAX("id") FROM "positions"), 1), (SELECT MAX("id") IS NOT NULL FROM "positions"));
SELECT setval(pg_get_serial_sequence('roles', 'id'), COALESCE((SELECT MAX("id") FROM "roles"), 1), (SELECT MAX("id") IS NOT NULL FROM "roles"));
SELECT setval(pg_get_serial_sequence('tickets', 'id'), COALESCE((SELECT MAX("id") FROM "tickets"), 1), (SELECT MAX("id") IS NOT NULL FROM "tickets"));
SELECT setval(pg_get_serial_sequence('ticket_approvals', 'id'), COALESCE((SELECT MAX("id") FROM "ticket_approvals"), 1), (SELECT MAX("id") IS NOT NULL FROM "ticket_approvals"));
SELECT setval(pg_get_serial_sequence('ticket_attachments', 'id'), COALESCE((SELECT MAX("id") FROM "ticket_attachments"), 1), (SELECT MAX("id") IS NOT NULL FROM "ticket_attachments"));
SELECT setval(pg_get_serial_sequence('ticket_categories', 'id'), COALESCE((SELECT MAX("id") FROM "ticket_categories"), 1), (SELECT MAX("id") IS NOT NULL FROM "ticket_categories"));
SELECT setval(pg_get_serial_sequence('ticket_forward_histories', 'id'), COALESCE((SELECT MAX("id") FROM "ticket_forward_histories"), 1), (SELECT MAX("id") IS NOT NULL FROM "ticket_forward_histories"));
SELECT setval(pg_get_serial_sequence('units', 'id'), COALESCE((SELECT MAX("id") FROM "units"), 1), (SELECT MAX("id") IS NOT NULL FROM "units"));
SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE((SELECT MAX("id") FROM "users"), 1), (SELECT MAX("id") IS NOT NULL FROM "users"));

CREATE INDEX IF NOT EXISTS "departments_head_id_foreign" ON "departments" ("head_id");
CREATE UNIQUE INDEX IF NOT EXISTS "failed_jobs_uuid_unique" ON "failed_jobs" ("uuid");
CREATE INDEX IF NOT EXISTS "model_has_permissions_model_id_model_type_index" ON "model_has_permissions" ("model_id","model_type");
CREATE INDEX IF NOT EXISTS "model_has_roles_model_id_model_type_index" ON "model_has_roles" ("model_id","model_type");
CREATE INDEX IF NOT EXISTS "notifications_notifiable_type_notifiable_id_index" ON "notifications" ("notifiable_type","notifiable_id");
CREATE UNIQUE INDEX IF NOT EXISTS "permissions_name_guard_name_unique" ON "permissions" ("name","guard_name");
CREATE UNIQUE INDEX IF NOT EXISTS "personal_access_tokens_token_unique" ON "personal_access_tokens" ("token");
CREATE INDEX IF NOT EXISTS "personal_access_tokens_tokenable_type_tokenable_id_index" ON "personal_access_tokens" ("tokenable_type","tokenable_id");
CREATE UNIQUE INDEX IF NOT EXISTS "roles_name_guard_name_unique" ON "roles" ("name","guard_name");
CREATE INDEX IF NOT EXISTS "role_has_permissions_role_id_foreign" ON "role_has_permissions" ("role_id");
CREATE UNIQUE INDEX IF NOT EXISTS "tickets_ticket_code_unique" ON "tickets" ("ticket_code");
CREATE INDEX IF NOT EXISTS "tickets_ticket_category_id_foreign" ON "tickets" ("ticket_category_id");
CREATE INDEX IF NOT EXISTS "tickets_created_by_foreign" ON "tickets" ("created_by");
CREATE INDEX IF NOT EXISTS "tickets_current_approver_id_foreign" ON "tickets" ("current_approver_id");
CREATE INDEX IF NOT EXISTS "tickets_unit_id_foreign" ON "tickets" ("unit_id");
CREATE INDEX IF NOT EXISTS "tickets_current_status_index" ON "tickets" ("current_status");
CREATE INDEX IF NOT EXISTS "tickets_created_at_index" ON "tickets" ("created_at");
CREATE INDEX IF NOT EXISTS "tickets_closed_at_index" ON "tickets" ("closed_at");
CREATE INDEX IF NOT EXISTS "tickets_status_approver_index" ON "tickets" ("current_status","current_approver_id");
CREATE INDEX IF NOT EXISTS "tickets_pic_status_index" ON "tickets" ("pic_id","current_status");
CREATE INDEX IF NOT EXISTS "tickets_department_status_index" ON "tickets" ("department_id","current_status");
CREATE INDEX IF NOT EXISTS "ticket_approvals_ticket_id_foreign" ON "ticket_approvals" ("ticket_id");
CREATE INDEX IF NOT EXISTS "ticket_approvals_approved_by_foreign" ON "ticket_approvals" ("approved_by");
CREATE INDEX IF NOT EXISTS "ticket_attachments_ticket_id_foreign" ON "ticket_attachments" ("ticket_id");
CREATE UNIQUE INDEX IF NOT EXISTS "ticket_categories_code_unique" ON "ticket_categories" ("code");
CREATE INDEX IF NOT EXISTS "ticket_categories_department_id_foreign" ON "ticket_categories" ("department_id");
CREATE INDEX IF NOT EXISTS "ticket_forward_histories_ticket_id_foreign" ON "ticket_forward_histories" ("ticket_id");
CREATE INDEX IF NOT EXISTS "ticket_forward_histories_from_department_id_foreign" ON "ticket_forward_histories" ("from_department_id");
CREATE INDEX IF NOT EXISTS "ticket_forward_histories_to_department_id_foreign" ON "ticket_forward_histories" ("to_department_id");
CREATE INDEX IF NOT EXISTS "ticket_forward_histories_forwarded_by_foreign" ON "ticket_forward_histories" ("forwarded_by");
CREATE INDEX IF NOT EXISTS "units_head_id_foreign" ON "units" ("head_id");
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_unique" ON "users" ("email");
CREATE INDEX IF NOT EXISTS "users_unit_id_foreign" ON "users" ("unit_id");
CREATE INDEX IF NOT EXISTS "users_department_id_foreign" ON "users" ("department_id");
CREATE INDEX IF NOT EXISTS "users_position_id_foreign" ON "users" ("position_id");

ALTER TABLE "departments" ADD CONSTRAINT "departments_head_id_foreign" FOREIGN KEY ("head_id") REFERENCES "users" ("id") ON DELETE SET NULL;
ALTER TABLE "model_has_permissions" ADD CONSTRAINT "model_has_permissions_permission_id_foreign" FOREIGN KEY ("permission_id") REFERENCES "permissions" ("id") ON DELETE CASCADE;
ALTER TABLE "model_has_roles" ADD CONSTRAINT "model_has_roles_role_id_foreign" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE CASCADE;
ALTER TABLE "role_has_permissions" ADD CONSTRAINT "role_has_permissions_permission_id_foreign" FOREIGN KEY ("permission_id") REFERENCES "permissions" ("id") ON DELETE CASCADE;
ALTER TABLE "role_has_permissions" ADD CONSTRAINT "role_has_permissions_role_id_foreign" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE CASCADE;
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_created_by_foreign" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ;
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_current_approver_id_foreign" FOREIGN KEY ("current_approver_id") REFERENCES "users" ("id") ON DELETE SET NULL;
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_department_id_foreign" FOREIGN KEY ("department_id") REFERENCES "departments" ("id") ;
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_pic_id_foreign" FOREIGN KEY ("pic_id") REFERENCES "users" ("id") ON DELETE SET NULL;
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_ticket_category_id_foreign" FOREIGN KEY ("ticket_category_id") REFERENCES "ticket_categories" ("id") ;
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_unit_id_foreign" FOREIGN KEY ("unit_id") REFERENCES "units" ("id") ON DELETE SET NULL;
ALTER TABLE "ticket_approvals" ADD CONSTRAINT "ticket_approvals_approved_by_foreign" FOREIGN KEY ("approved_by") REFERENCES "users" ("id") ;
ALTER TABLE "ticket_approvals" ADD CONSTRAINT "ticket_approvals_ticket_id_foreign" FOREIGN KEY ("ticket_id") REFERENCES "tickets" ("id") ON DELETE CASCADE;
ALTER TABLE "ticket_attachments" ADD CONSTRAINT "ticket_attachments_ticket_id_foreign" FOREIGN KEY ("ticket_id") REFERENCES "tickets" ("id") ON DELETE CASCADE;
ALTER TABLE "ticket_categories" ADD CONSTRAINT "ticket_categories_department_id_foreign" FOREIGN KEY ("department_id") REFERENCES "departments" ("id") ON DELETE SET NULL;
ALTER TABLE "ticket_forward_histories" ADD CONSTRAINT "ticket_forward_histories_forwarded_by_foreign" FOREIGN KEY ("forwarded_by") REFERENCES "users" ("id") ;
ALTER TABLE "ticket_forward_histories" ADD CONSTRAINT "ticket_forward_histories_from_department_id_foreign" FOREIGN KEY ("from_department_id") REFERENCES "departments" ("id") ;
ALTER TABLE "ticket_forward_histories" ADD CONSTRAINT "ticket_forward_histories_ticket_id_foreign" FOREIGN KEY ("ticket_id") REFERENCES "tickets" ("id") ON DELETE CASCADE;
ALTER TABLE "ticket_forward_histories" ADD CONSTRAINT "ticket_forward_histories_to_department_id_foreign" FOREIGN KEY ("to_department_id") REFERENCES "departments" ("id") ;
ALTER TABLE "units" ADD CONSTRAINT "units_head_id_foreign" FOREIGN KEY ("head_id") REFERENCES "users" ("id") ON DELETE SET NULL;
ALTER TABLE "users" ADD CONSTRAINT "users_department_id_foreign" FOREIGN KEY ("department_id") REFERENCES "departments" ("id") ON DELETE SET NULL;
ALTER TABLE "users" ADD CONSTRAINT "users_position_id_foreign" FOREIGN KEY ("position_id") REFERENCES "positions" ("id") ON DELETE SET NULL;
ALTER TABLE "users" ADD CONSTRAINT "users_unit_id_foreign" FOREIGN KEY ("unit_id") REFERENCES "units" ("id") ON DELETE SET NULL;
COMMIT;
