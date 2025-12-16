-- Insert user baru: syahrul (admin)
-- Password: syahrul123 (akan di-hash dengan bcrypt)

-- Gunakan SQL ini di PostgreSQL untuk insert user baru
-- Note: Password harus di-hash dengan bcrypt terlebih dahulu

-- Cara 1: Menggunakan extension pgcrypto (jika tersedia)
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- INSERT INTO users (id, username, password, email, role, created_at, updated_at)
-- VALUES (
--     gen_random_uuid(),
--     'syahrul',
--     crypt('syahrul123', gen_salt('bf')),
--     'syahrulramadhancalu@gmail.com',
--     'admin',
--     CURRENT_TIMESTAMP,
--     CURRENT_TIMESTAMP
-- );

-- Cara 2: Menggunakan hash bcrypt yang sudah di-generate
-- Hash bcrypt untuk password 'syahrul123':
-- $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

INSERT INTO users (id, username, password, email, role, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'syahrul',
    '$2a$12$cpk04IcXqGF666i31F6DQuj1Pd5FnjGRSDeZHmlZBqutnSZqiBjfq',
    'syahrulramadhancalu@gmail.com',
    'admin',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Verifikasi user berhasil dibuat
SELECT id, username, email, role, created_at FROM users WHERE username = 'syahrul';
