ALTER TABLE `users`  ADD `password_reset_token` VARCHAR(255) NULL DEFAULT NULL  AFTER `activation_key`;