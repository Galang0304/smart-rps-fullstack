-- Bersihkan data lama
DELETE FROM sub_cpmk WHERE cpmk_id IN (SELECT id FROM cpmk WHERE course_id IN (SELECT id FROM courses WHERE code = 'IF601'));
DELETE FROM cpmk WHERE course_id IN (SELECT id FROM courses WHERE code = 'IF601');
DELETE FROM courses WHERE code = 'IF601';

-- Insert mata kuliah
INSERT INTO courses (id, code, title, credits, semester, tahun, program_id, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'IF601',
    'Pemrograman Web Lanjut',
    3,
    6,
    '2024',
    (SELECT id FROM programs LIMIT 1),
    NOW(),
    NOW()
);

-- Insert CPMK dan Sub-CPMK
DO $$
DECLARE
    v_course_id UUID;
    v_cpmk_id UUID;
BEGIN
    SELECT id INTO v_course_id FROM courses WHERE code = 'IF601';
    
    -- Insert 1 CPMK
    INSERT INTO cpmk (id, course_id, cpmk_number, description, created_at, updated_at)
    VALUES (gen_random_uuid(), v_course_id, 1, 'Mahasiswa mampu menganalisis, merancang, dan mengimplementasikan aplikasi web modern dengan framework terkini', NOW(), NOW())
    RETURNING id INTO v_cpmk_id;
    
    -- Insert 16 Sub-CPMK (14 pertemuan + UTS minggu 8 + UAS minggu 16)
    INSERT INTO sub_cpmk (id, cpmk_id, sub_cpmk_number, description, created_at, updated_at)
    VALUES (gen_random_uuid(), v_cpmk_id, 1, 'Mahasiswa mampu memahami konsep dasar web modern', NOW(), NOW());
    
    INSERT INTO sub_cpmk (id, cpmk_id, sub_cpmk_number, description, created_at, updated_at)
    VALUES (gen_random_uuid(), v_cpmk_id, 2, 'Mahasiswa mampu menerapkan framework React', NOW(), NOW());
    
    INSERT INTO sub_cpmk (id, cpmk_id, sub_cpmk_number, description, created_at, updated_at)
    VALUES (gen_random_uuid(), v_cpmk_id, 3, 'Mahasiswa mampu mengimplementasikan RESTful API', NOW(), NOW());
    
    INSERT INTO sub_cpmk (id, cpmk_id, sub_cpmk_number, description, created_at, updated_at)
    VALUES (gen_random_uuid(), v_cpmk_id, 4, 'Mahasiswa mampu merancang database relasional', NOW(), NOW());
    
    INSERT INTO sub_cpmk (id, cpmk_id, sub_cpmk_number, description, created_at, updated_at)
    VALUES (gen_random_uuid(), v_cpmk_id, 5, 'Mahasiswa mampu menerapkan autentikasi dan otorisasi', NOW(), NOW());
    
    INSERT INTO sub_cpmk (id, cpmk_id, sub_cpmk_number, description, created_at, updated_at)
    VALUES (gen_random_uuid(), v_cpmk_id, 6, 'Mahasiswa mampu mengintegrasikan frontend dan backend', NOW(), NOW());
    
    INSERT INTO sub_cpmk (id, cpmk_id, sub_cpmk_number, description, created_at, updated_at)
    VALUES (gen_random_uuid(), v_cpmk_id, 7, 'Mahasiswa mampu menerapkan state management', NOW(), NOW());
    
    -- Minggu 8: UTS
    INSERT INTO sub_cpmk (id, cpmk_id, sub_cpmk_number, description, created_at, updated_at)
    VALUES (gen_random_uuid(), v_cpmk_id, 8, 'Ujian Tengah Semester (UTS)', NOW(), NOW());
    
    INSERT INTO sub_cpmk (id, cpmk_id, sub_cpmk_number, description, created_at, updated_at)
    VALUES (gen_random_uuid(), v_cpmk_id, 9, 'Mahasiswa mampu mengimplementasikan responsive design', NOW(), NOW());
    
    INSERT INTO sub_cpmk (id, cpmk_id, sub_cpmk_number, description, created_at, updated_at)
    VALUES (gen_random_uuid(), v_cpmk_id, 10, 'Mahasiswa mampu menerapkan testing', NOW(), NOW());
    
    INSERT INTO sub_cpmk (id, cpmk_id, sub_cpmk_number, description, created_at, updated_at)
    VALUES (gen_random_uuid(), v_cpmk_id, 11, 'Mahasiswa mampu menggunakan version control Git', NOW(), NOW());
    
    INSERT INTO sub_cpmk (id, cpmk_id, sub_cpmk_number, description, created_at, updated_at)
    VALUES (gen_random_uuid(), v_cpmk_id, 12, 'Mahasiswa mampu melakukan deployment ke cloud', NOW(), NOW());
    
    INSERT INTO sub_cpmk (id, cpmk_id, sub_cpmk_number, description, created_at, updated_at)
    VALUES (gen_random_uuid(), v_cpmk_id, 13, 'Mahasiswa mampu mengoptimasi performa aplikasi', NOW(), NOW());
    
    INSERT INTO sub_cpmk (id, cpmk_id, sub_cpmk_number, description, created_at, updated_at)
    VALUES (gen_random_uuid(), v_cpmk_id, 14, 'Mahasiswa mampu menerapkan security best practices', NOW(), NOW());
    
    INSERT INTO sub_cpmk (id, cpmk_id, sub_cpmk_number, description, created_at, updated_at)
    VALUES (gen_random_uuid(), v_cpmk_id, 15, 'Mahasiswa mampu mengimplementasikan real-time features', NOW(), NOW());
    
    -- Minggu 16: UAS
    INSERT INTO sub_cpmk (id, cpmk_id, sub_cpmk_number, description, created_at, updated_at)
    VALUES (gen_random_uuid(), v_cpmk_id, 16, 'Ujian Akhir Semester (UAS)', NOW(), NOW());
    
    RAISE NOTICE 'Berhasil membuat 16 Sub-CPMK untuk mata kuliah IF601 (termasuk UTS dan UAS)';
END $$;

-- Verifikasi
SELECT 
    c.code,
    c.title,
    COUNT(DISTINCT sc.id) as jumlah_sub_cpmk
FROM courses c
LEFT JOIN cpmk cp ON c.id = cp.course_id
LEFT JOIN sub_cpmk sc ON cp.id = sc.cpmk_id
WHERE c.code = 'IF601'
GROUP BY c.code, c.title;
