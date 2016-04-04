ALTER TABLE `spliit`.`users_comments` DROP PRIMARY KEY, ADD PRIMARY KEY (`id_users_comments`, `id_deal`, `id_cust`, `id_owner`) USING BTREE;

ALTER TABLE `spliit`.`users_comments` DROP INDEX `id_users_comments`, ADD UNIQUE `id_users_comments` (`id_cust`, `id_deal`, `id_owner`) USING BTREE;