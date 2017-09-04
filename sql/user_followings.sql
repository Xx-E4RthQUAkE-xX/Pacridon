DROP TABLE IF EXISTS `user_followings`;

CREATE TABLE `user_followings` (
  `user_id` int(11) NOT NULL,
  `target_id` int(11) NOT NULL,
  UNIQUE(`user_id`, `target_id`)
);