-- Migration number: 0001 	 2026-03-24T12:21:20.786Z
CREATE TABLE `users` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `username` text NOT NULL,
  `jwt_sub` text NOT NULL,
  `created_at` text DEFAULT CURRENT_TIMESTAMP,
  `role` text DEFAULT 'guest' NOT NULL
);

--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);

--> statement-breakpoint
CREATE UNIQUE INDEX `users_jwt_sub_unique` ON `users` (`jwt_sub`);
