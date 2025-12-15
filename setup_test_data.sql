-- Clean up existing data
DELETE FROM sub_cpmks;
DELETE FROM cpmks;
DELETE FROM generated_rps;
DELETE FROM courses;

-- Insert test course
INSERT INTO courses (id, code, title, credits, semester, category, tahun, program_id, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'IF601',
    'Pemrograman Web Lanjut',
    3,
    6,
    'MK Wajib',
    '2024',
    (SELECT id FROM programs LIMIT 1),
    NOW(),
    NOW()
) RETURNING id;

-- Get course ID for next operations
DO $$
DECLARE
    course_id UUID;
    cpmk1_id UUID;
    cpmk2_id UUID;
    cpmk3_id UUID;
    cpmk4_id UUID;
    cpmk5_id UUID;
BEGIN
    -- Get the course ID we just created
    SELECT id INTO course_id FROM courses WHERE code = 'IF601';
    
    -- Insert 5 CPMKs
    INSERT INTO cpmks (id, course_id, cpmk_number, description, created_at, updated_at)
    VALUES (gen_random_uuid(), course_id, 'CPMK-1', 'Mahasiswa mampu memahami konsep dasar dan arsitektur aplikasi web modern', NOW(), NOW())
    RETURNING id INTO cpmk1_id;
    
    INSERT INTO cpmks (id, course_id, cpmk_number, description, created_at, updated_at)
    VALUES (gen_random_uuid(), course_id, 'CPMK-2', 'Mahasiswa mampu mengimplementasikan frontend dengan framework modern', NOW(), NOW())
    RETURNING id INTO cpmk2_id;
    
    INSERT INTO cpmks (id, course_id, cpmk_number, description, created_at, updated_at)
    VALUES (gen_random_uuid(), course_id, 'CPMK-3', 'Mahasiswa mampu membangun backend API dengan arsitektur RESTful', NOW(), NOW())
    RETURNING id INTO cpmk3_id;
    
    INSERT INTO cpmks (id, course_id, cpmk_number, description, created_at, updated_at)
    VALUES (gen_random_uuid(), course_id, 'CPMK-4', 'Mahasiswa mampu mengintegrasikan database dan mengelola data aplikasi', NOW(), NOW())
    RETURNING id INTO cpmk4_id;
    
    INSERT INTO cpmks (id, course_id, cpmk_number, description, created_at, updated_at)
    VALUES (gen_random_uuid(), course_id, 'CPMK-5', 'Mahasiswa mampu melakukan deployment dan maintenance aplikasi web', NOW(), NOW())
    RETURNING id INTO cpmk5_id;
    
    -- Insert 16 Sub-CPMKs distributed across 5 CPMKs
    -- CPMK 1: 4 Sub-CPMKs
    INSERT INTO sub_cpmks (id, cpmk_id, sub_cpmk_number, description, created_at, updated_at) VALUES
    (gen_random_uuid(), cpmk1_id, '1.1', 'Memahami HTTP protocol dan request-response cycle', NOW(), NOW()),
    (gen_random_uuid(), cpmk1_id, '1.2', 'Memahami arsitektur MVC dan design patterns', NOW(), NOW()),
    (gen_random_uuid(), cpmk1_id, '1.3', 'Memahami konsep client-server architecture', NOW(), NOW()),
    (gen_random_uuid(), cpmk1_id, '1.4', 'Memahami Single Page Application (SPA) concept', NOW(), NOW());
    
    -- CPMK 2: 3 Sub-CPMKs
    INSERT INTO sub_cpmks (id, cpmk_id, sub_cpmk_number, description, created_at, updated_at) VALUES
    (gen_random_uuid(), cpmk2_id, '2.1', 'Menggunakan React untuk membangun user interface', NOW(), NOW()),
    (gen_random_uuid(), cpmk2_id, '2.2', 'Mengelola state dan props dalam aplikasi React', NOW(), NOW()),
    (gen_random_uuid(), cpmk2_id, '2.3', 'Mengimplementasikan routing dan navigation', NOW(), NOW());
    
    -- CPMK 3: 4 Sub-CPMKs
    INSERT INTO sub_cpmks (id, cpmk_id, sub_cpmk_number, description, created_at, updated_at) VALUES
    (gen_random_uuid(), cpmk3_id, '3.1', 'Membuat RESTful API endpoints dengan Express/Gin', NOW(), NOW()),
    (gen_random_uuid(), cpmk3_id, '3.2', 'Mengimplementasikan authentication dan authorization', NOW(), NOW()),
    (gen_random_uuid(), cpmk3_id, '3.3', 'Menangani validasi data dan error handling', NOW(), NOW()),
    (gen_random_uuid(), cpmk3_id, '3.4', 'Mengimplementasikan middleware dan request processing', NOW(), NOW());
    
    -- CPMK 4: 3 Sub-CPMKs
    INSERT INTO sub_cpmks (id, cpmk_id, sub_cpmk_number, description, created_at, updated_at) VALUES
    (gen_random_uuid(), cpmk4_id, '4.1', 'Mendesain database schema dengan normalisasi', NOW(), NOW()),
    (gen_random_uuid(), cpmk4_id, '4.2', 'Menggunakan ORM untuk database operations', NOW(), NOW()),
    (gen_random_uuid(), cpmk4_id, '4.3', 'Mengoptimasi query dan indexing database', NOW(), NOW());
    
    -- CPMK 5: 2 Sub-CPMKs
    INSERT INTO sub_cpmks (id, cpmk_id, sub_cpmk_number, description, created_at, updated_at) VALUES
    (gen_random_uuid(), cpmk5_id, '5.1', 'Melakukan deployment aplikasi ke production server', NOW(), NOW()),
    (gen_random_uuid(), cpmk5_id, '5.2', 'Monitoring, logging, dan troubleshooting aplikasi', NOW(), NOW());
    
END $$;

-- Show results
SELECT 'Courses created:' as info, COUNT(*) as count FROM courses WHERE code = 'IF601';
SELECT 'CPMKs created:' as info, COUNT(*) as count FROM cpmks WHERE course_id = (SELECT id FROM courses WHERE code = 'IF601');
SELECT 'Sub-CPMKs created:' as info, COUNT(*) as count FROM sub_cpmks WHERE cpmk_id IN (SELECT id FROM cpmks WHERE course_id = (SELECT id FROM courses WHERE code = 'IF601'));
