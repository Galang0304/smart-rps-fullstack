-- =============================================================
-- SCRIPT: Bersihkan Semua Data Kecuali Akun Admin
-- =============================================================
-- Script ini akan menghapus semua data dari database
-- KECUALI akun dengan role 'admin'
-- 
-- PERINGATAN: Aksi ini TIDAK BISA DI-UNDO!
-- Backup database Anda sebelum menjalankan script ini!
-- =============================================================

BEGIN;

-- 1. Hapus semua data CPL dan Indikator
DELETE FROM cpl_indikator;
DELETE FROM cpl;

-- 2. Hapus akses dosen ke RPS
DELETE FROM dosen_rps_access;

-- 3. Hapus generated RPS
DELETE FROM generated_rps;

-- 4. Hapus template versions
DELETE FROM template_versions;

-- 5. Hapus templates
DELETE FROM templates;

-- 6. Hapus courses
DELETE FROM courses;

-- 7. Hapus programs
DELETE FROM programs;

-- 8. Hapus dosens
DELETE FROM dosens;

-- 9. Hapus prodis
DELETE FROM prodis;

-- 10. Hapus users KECUALI yang role = 'admin'
DELETE FROM users WHERE role != 'admin';

-- Reset sequences (jika ada auto-increment, tapi PostgreSQL pakai UUID jadi tidak perlu)

COMMIT;

-- Verifikasi hasil
SELECT 'users' as table_name, COUNT(*) as remaining_records FROM users
UNION ALL
SELECT 'prodis', COUNT(*) FROM prodis
UNION ALL
SELECT 'programs', COUNT(*) FROM programs
UNION ALL
SELECT 'dosens', COUNT(*) FROM dosens
UNION ALL
SELECT 'courses', COUNT(*) FROM courses
UNION ALL
SELECT 'templates', COUNT(*) FROM templates
UNION ALL
SELECT 'template_versions', COUNT(*) FROM template_versions
UNION ALL
SELECT 'generated_rps', COUNT(*) FROM generated_rps
UNION ALL
SELECT 'dosen_rps_access', COUNT(*) FROM dosen_rps_access
UNION ALL
SELECT 'cpl', COUNT(*) FROM cpl
UNION ALL
SELECT 'cpl_indikator', COUNT(*) FROM cpl_indikator;

-- Tampilkan user yang tersisa (seharusnya hanya admin)
SELECT username, email, role FROM users;
