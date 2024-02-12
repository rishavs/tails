CREATE TABLE IF NOT EXISTS `sessions` ( 
    `id`            VARCHAR(32) PRIMARY KEY, --Stronger bits as this is public
    `user_id`       VARCHAR(32) NOT NULL,
    `user_agent`    VARCHAR(256) NOT NULL,
    `created_at`    timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `deleted_at`    timestamp DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS `blocked_ids` (
    `oauth_id`  varchar(32) PRIMARY KEY
)

CREATE TABLE IF NOT EXISTS `users` ( 
    `id`            varchar(32) PRIMARY KEY,
    `google_id`     varchar(64) UNIQUE, 
    `apple_id`      varchar(64) UNIQUE,

    `slug`          varchar(32) NOT NULL UNIQUE, 
    `name`          varchar(32) NOT NULL, 
    `thumb`         varchar(128) NOT NULL, 

    `honorific`     varchar(32) NOT NULL, 
    `flair`         varchar(128) NOT NULL, 
    `role`          varchar(8) NOT NULL, 
    `level`         varchar(16) NOT NULL,
    `stars`         int NOT NULL DEFAULT 0, 
    `creds`         int NOT NULL DEFAULT 0,
    `gil`           int NOT NULL DEFAULT 0,

    `current_warning_count` int NOT NULL DEFAULT 0, -- warning levels increases on subesequent warnings. reduces when user is good.
    `last_warned_at`        timestamp,
    `warned_till`           timestamp,
    `warned_for`            varchar(128),
    `total_warning_count`   int NOT NULL DEFAULT 0, -- total number of times user has been warned

    `exiled_at`             timestamp,
    `exiled_till`           timestamp,
    `exiled_note`            varchar(128),
    `total_exiled_count`    int DEFAULT 0, -- total number of times user has been exiled

    `banned_at`             timestamp,
    `banned_till`           timestamp,
    `banned_note`           varchar(128),    -- note to self. not to be shown to end users
    `total_banned_count`    int DEFAULT 0, -- total number of times user has been banned

    `created_at`    timestamp DEFAULT CURRENT_TIMESTAMP, 
    `updated_at`    timestamp DEFAULT CURRENT_TIMESTAMP, 
    `deleted_at`    timestamp DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS `punishments` (
    `user_id`       varchar(24) NOT NULL,
    `post_id`       varchar(24) NOT NULL,
    `punishment_type` varchar(32) NOT NULL,
    `punished_by`   varchar(32) NOT NULL,
    `punished_for`  varchar(32) NOT NULL,
    `punished_at`   timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `punished_till` timestamp NOT NULL,
    `punished_note` varchar(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS `blocked_domains` (
    `domain`        varchar(128) PRIMARY KEY, 
    `blocked_at`     timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    `blocked_till`   timestamp NOT NULL,
    `blocked_note`   varchar(128)    -- note to self. not to be shown to end users
);


CREATE TABLE IF NOT EXISTS `post_categories` ( 
    `id`            int PRIMARY KEY, 
    `name`          varchar(32) NOT NULL, 
    `description`   varchar(128) NOT NULL, 

    `deleted_at`    timestamp NULL DEFAULT NULL, 
)

CREATE TABLE IF NOT EXISTS `posts` ( 
    `id`            varchar(24) PRIMARY KEY, 
    `is_root`       boolean NOT NULL DEFAULT true,
    `parent_id`     varchar(24) NOT NULL, -- for root posts, parent_id = post_id

    `author_id`     varchar(16) NOT NULL, 

    -- optional fields
    `slug`          varchar(32) UNIQUE, 
    `category`      varchar(4), 
    `title`         varchar(256), 
    `link`          varchar(256), 
    `thumb`         varchar(256), 

    -- text content
    `content`       varchar(4096), 

    -- stats
    `digs_count`    int NOT NULL DEFAULT 1, -- update every time user digs
    `buries_count`  int NOT NULL DEFAULT 0, -- NOT Implmented for now
    `comments_count`int NOT NULL DEFAULT 0, -- update every time user comments
    `saves_count`   int NOT NULL DEFAULT 0, -- update every time user saves
    
    -- `comments_value`int NOT NULL, -- sum of all comments' digs. NOT Implmented for now
    -- `total_value`   int NOT NULL, -- digs count - buries count + avg comments value + saves count

    `is_locked`     boolean NOT NULL DEFAULT false,
    `locked_for`    text,

    `created_at`    timestamp NULL DEFAULT CURRENT_TIMESTAMP, 
    `updated_at`    timestamp NULL DEFAULT CURRENT_TIMESTAMP, 
    `archived_at`   timestamp , -- after n days, archive posts. archived posts are not shown in feed and are read only
    `locked_at`     timestamp , -- similar to archived_at but is done intentionally for posts which are running off course
    `deleted_at`    timestamp 
) ;

CREATE TABLE IF NOT EXISTS `posts_dug` (
    `post_id`       varchar(24) NOT NULL, 
    `user_id`       varchar(16) NOT NULL, 
    PRIMARY KEY (`post_id`, `user_id`)
);

CREATE TABLE IF NOT EXISTS `posts_buried` (
    `post_id`       varchar(24) NOT NULL, 
    `user_id`       varchar(16) NOT NULL, 
    PRIMARY KEY (`post_id`, `user_id`)
);

CREATE TABLE IF NOT EXISTS `posts_saved` (
    `post_id`       varchar(24) NOT NULL, 
    `user_id`       varchar(16) NOT NULL, 
    `list_name`     varchar(32) NOT NULL, 
    PRIMARY KEY (`post_id`, `user_id`, `list_name`)
);

CREATE TABLE IF NOT EXISTS `posts_reported` (
    `post_id`       varchar(24) NOT NULL, 
    `reported_by`   VARCHAR(16) NOT NULL,
    `reported_for`  VARCHAR(32) NOT NULL,
        -- 'Harassment', 
        -- 'Violates community guidelines', 
        -- 'Spam', 
        -- 'Sharing personal information', 
        -- 'Self harm', 
        -- 'Illegal activity'
        -- ) NOT NULL,
    `extra_details` VARCHAR(256),

    `reported_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `resolved_by` VARCHAR(16) DEFAULT NULL,
    `resolved_note` VARCHAR(256) DEFAULT NULL,
    `resolved_at`  TIMESTAMP DEFAULT NULL
);