CREATE TABLE `catch_questions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `catch_questions_user_id_unique` ON `catch_questions` (`user_id`);