-- CREATE DATABASE web4;

\c web4;

CREATE TABLE IF NOT EXISTS users
(
    id           BIGSERIAL PRIMARY KEY,
    username     VARCHAR(50) UNIQUE NOT NULL,
    password     VARCHAR(255)       NOT NULL,
    group_number VARCHAR(10)        NOT NULL,
    enabled      BOOLEAN            NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMP                   DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS points
(
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT           NOT NULL,
    x            DECIMAL(10, 4)   NOT NULL,
    y            DECIMAL(10, 4)   NOT NULL,
    r            DECIMAL(10, 4)   NOT NULL,
    hit          BOOLEAN          NOT NULL,
    calc_time    DOUBLE PRECISION NOT NULL,
    release_time TIMESTAMP        NOT NULL,
    CONSTRAINT fk_point_user FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_points_user_id ON points (user_id);
CREATE INDEX IF NOT EXISTS idx_points_release_time ON points (release_time DESC);
CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);

INSERT INTO users (username, password, group_number, enabled)
VALUES ('BanhMiQue',
        '$2a$12$6BASqcjQn7QDudnFk6hzXubex01ZYxPLrHiksA52SQsO.HnEAhuta',
        'yummy',
        TRUE)
ON CONFLICT (username) DO NOTHING;