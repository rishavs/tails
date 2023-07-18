CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(32) NOT NULL UNIQUE,
    name VARCHAR(32) NOT NULL,
    thumb VARCHAR(128),
    honorific VARCHAR(32),
    flair VARCHAR(128),
    role VARCHAR(8) NOT NULL,
    level VARCHAR(16) NOT NULL,
    stars INT DEFAULT 1,
    creds INT DEFAULT 1,
    gil INT DEFAULT 0,

    email NOT NULL UNIQUE,

    warned_till TIMESTAMP,
    exiled_till TIMESTAMP,
    banned_till TIMESTAMP,

    warn_count INT DEFAULT 0,
    exiled_count INT DEFAULT 0,
    banned_count INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,

    session_id VARCHAR(32) NOT NULL UNIQUE,
    user_id INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
