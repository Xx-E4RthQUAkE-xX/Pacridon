DROP TABLE IF EXISTS `toots`;
CREATE TABLE `toots` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` int(11) NOT NULL,
  `body` TEXT
);