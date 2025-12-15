-- Bersihkan data existing
DELETE FROM requirements;
DELETE FROM sub_cpmks;
DELETE FROM cpmks;
DELETE FROM courses WHERE code = 'IF601';

-- Insert mata kuliah test
INSERT INTO courses (id, code, title, credits, semester, category, tahun, prodi_id, program_id, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'IF601',
    'Pemrograman Web Lanjut',
    3,
    6,
    'Wajib',
    '2024',
    (SELECT id FROM prodis LIMIT 1),
    (SELECT id FROM programs LIMIT 1),
    NOW(),
    NOW()
);

-- Insert data dengan stored procedure
DO $$
DECLARE
    v_course_id UUID;
    v_cpmk_id UUID;
    v_sub_id UUID;
    v_week INT;
BEGIN
    SELECT id INTO v_course_id FROM courses WHERE code = 'IF601';
    
    -- Insert 1 CPMK
    INSERT INTO cpmks (id, course_id, cpmk_number, description, created_at, updated_at)
    VALUES (
        gen_random_uuid(),
        v_course_id,
        'CPMK-1',
        'Mahasiswa mampu menganalisis, merancang, dan mengimplementasikan aplikasi web modern dengan framework terkini serta menerapkan best practices dalam pengembangan perangkat lunak',
        NOW(),
        NOW()
    ) RETURNING id INTO v_cpmk_id;
    
    -- Sub-CPMK 1: 8 requirements (Minggu 1-7, skip minggu 8 UTS)
    INSERT INTO sub_cpmks (id, cpmk_id, sub_cpmk_number, description, created_at, updated_at)
    VALUES (gen_random_uuid(), v_cpmk_id, 'Sub-CPMK-1', 'Mahasiswa mampu memahami konsep dasar web modern dan arsitektur aplikasi', NOW(), NOW())
    RETURNING id INTO v_sub_id;
    
    FOR v_week IN 1..7 LOOP
        INSERT INTO requirements (id, sub_cpmk_id, week, material, method, student_experience, assessment_criteria, weight, created_at, updated_at)
        VALUES (gen_random_uuid(), v_sub_id, v_week, 
                'Materi Minggu ' || v_week || ': Penganalan Web Development', 
                'Ceramah dan Praktikum', 
                'Mengikuti kuliah dan praktikum', 
                'Ketepatan konsep', 
                15, NOW(), NOW());
    END LOOP;
    
    -- Sub-CPMK 2: 7 requirements
    INSERT INTO sub_cpmks (id, cpmk_id, sub_cpmk_number, description, created_at, updated_at)
    VALUES (gen_random_uuid(), v_cpmk_id, 'Sub-CPMK-2', 'Mahasiswa mampu menerapkan framework frontend React', NOW(), NOW())
    RETURNING id INTO v_sub_id;
    
    FOR v_week IN 1..7 LOOP
        INSERT INTO requirements (id, sub_cpmk_id, week, material, method, student_experience, assessment_criteria, weight, created_at, updated_at)
        VALUES (gen_random_uuid(), v_sub_id, v_week, 
                'Materi Minggu ' || v_week || ': Framework React', 
                'Praktikum', 
                'Membuat komponen React', 
                'Kualitas komponen', 
                12, NOW(), NOW());
    END LOOP;
    
    -- Sub-CPMK 3: 6 requirements
    INSERT INTO sub_cpmks (id, cpmk_id, sub_cpmk_number, description, created_at, updated_at)
    VALUES (gen_random_uuid(), v_cpmk_id, 'Sub-CPMK-3', 'Mahasiswa mampu mengimplementasikan RESTful API', NOW(), NOW())
    RETURNING id INTO v_sub_id;
    
    FOR v_week IN 1..6 LOOP
        INSERT INTO requirements (id, sub_cpmk_id, week, material, method, student_experience, assessment_criteria, weight, created_at, updated_at)
        VALUES (gen_random_uuid(), v_sub_id, v_week, 
                'Materi Minggu ' || v_week || ': RESTful API', 
                'Case Study', 
                'Membangun API endpoints', 
                'Struktur API', 
                13, NOW(), NOW());
    END LOOP;
    
    -- Sub-CPMK 4: 5 requirements
    INSERT INTO sub_cpmks (id, cpmk_id, sub_cpmk_number, description, created_at, updated_at)
    VALUES (gen_random_uuid(), v_cpmk_id, 'Sub-CPMK-4', 'Mahasiswa mampu merancang database relasional', NOW(), NOW())
    RETURNING id INTO v_sub_id;
    
    FOR v_week IN 1..5 LOOP
        INSERT INTO requirements (id, sub_cpmk_id, week, material, method, student_experience, assessment_criteria, weight, created_at, updated_at)
        VALUES (gen_random_uuid(), v_sub_id, v_week, 
                'Materi Minggu ' || v_week || ': Database Design', 
                'Praktikum Database', 
                'Merancang schema', 
                'Normalisasi', 
                14, NOW(), NOW());
    END LOOP;
    
    -- Sub-CPMK 5: 5 requirements
    INSERT INTO sub_cpmks (id, cpmk_id, sub_cpmk_number, description, created_at, updated_at)
    VALUES (gen_random_uuid(), v_cpmk_id, 'Sub-CPMK-5', 'Mahasiswa mampu menerapkan autentikasi dan otorisasi', NOW(), NOW())
    RETURNING id INTO v_sub_id;
    
    FOR v_week IN 1..5 LOOP
        INSERT INTO requirements (id, sub_cpmk_id, week, material, method, student_experience, assessment_criteria, weight, created_at, updated_at)
        VALUES (gen_random_uuid(), v_sub_id, v_week, 
                'Materi Minggu ' || v_week || ': Authentication', 
                'Praktikum Security', 
                'Implementasi JWT', 
                'Token management', 
                15, NOW(), NOW());
    END LOOP;
    
    -- Sub-CPMK 6: 4 requirements
    INSERT INTO sub_cpmks (id, cpmk_id, sub_cpmk_number, description, created_at, updated_at)
    VALUES (gen_random_uuid(), v_cpmk_id, 'Sub-CPMK-6', 'Mahasiswa mampu mengintegrasikan frontend dan backend', NOW(), NOW())
    RETURNING id INTO v_sub_id;
    
    FOR v_week IN 1..4 LOOP
        INSERT INTO requirements (id, sub_cpmk_id, week, material, method, student_experience, assessment_criteria, weight, created_at, updated_at)
        VALUES (gen_random_uuid(), v_sub_id, v_week, 
                'Materi Minggu ' || v_week || ': Integration', 
                'Project Integration', 
                'Menghubungkan frontend-backend', 
                'Data flow', 
                11, NOW(), NOW());
    END LOOP;
    
    -- Sub-CPMK 7: 6 requirements
    INSERT INTO sub_cpmks (id, cpmk_id, sub_cpmk_number, description, created_at, updated_at)
    VALUES (gen_random_uuid(), v_cpmk_id, 'Sub-CPMK-7', 'Mahasiswa mampu menerapkan state management', NOW(), NOW())
    RETURNING id INTO v_sub_id;
    
    FOR v_week IN 1..6 LOOP
        INSERT INTO requirements (id, sub_cpmk_id, week, material, method, student_experience, assessment_criteria, weight, created_at, updated_at)
        VALUES (gen_random_uuid(), v_sub_id, v_week, 
                'Materi Minggu ' || v_week || ': State Management', 
                'Praktikum Redux', 
                'Implementasi global state', 
                'State pattern', 
                12, NOW(), NOW());
    END LOOP;
    
    -- Sub-CPMK 8: 5 requirements
    INSERT INTO sub_cpmks (id, cpmk_id, sub_cpmk_number, description, created_at, updated_at)
    VALUES (gen_random_uuid(), v_cpmk_id, 'Sub-CPMK-8', 'Mahasiswa mampu mengimplementasikan responsive design', NOW(), NOW())
    RETURNING id INTO v_sub_id;
    
    FOR v_week IN 1..5 LOOP
        INSERT INTO requirements (id, sub_cpmk_id, week, material, method, student_experience, assessment_criteria, weight, created_at, updated_at)
        VALUES (gen_random_uuid(), v_sub_id, v_week, 
                'Materi Minggu ' || v_week || ': Responsive Design', 
                'Design Workshop', 
                'Membuat responsive layout', 
                'Responsiveness', 
                10, NOW(), NOW());
    END LOOP;
    
    -- Sub-CPMK 9: 4 requirements
    INSERT INTO sub_cpmks (id, cpmk_id, sub_cpmk_number, description, created_at, updated_at)
    VALUES (gen_random_uuid(), v_cpmk_id, 'Sub-CPMK-9', 'Mahasiswa mampu menerapkan testing', NOW(), NOW())
    RETURNING id INTO v_sub_id;
    
    FOR v_week IN 1..4 LOOP
        INSERT INTO requirements (id, sub_cpmk_id, week, material, method, student_experience, assessment_criteria, weight, created_at, updated_at)
        VALUES (gen_random_uuid(), v_sub_id, v_week, 
                'Materi Minggu ' || v_week || ': Testing', 
                'Praktikum Testing', 
                'Menulis unit tests', 
                'Test coverage', 
                13, NOW(), NOW());
    END LOOP;
    
    -- Sub-CPMK 10: 3 requirements
    INSERT INTO sub_cpmks (id, cpmk_id, sub_cpmk_number, description, created_at, updated_at)
    VALUES (gen_random_uuid(), v_cpmk_id, 'Sub-CPMK-10', 'Mahasiswa mampu menggunakan version control Git', NOW(), NOW())
    RETURNING id INTO v_sub_id;
    
    FOR v_week IN 1..3 LOOP
        INSERT INTO requirements (id, sub_cpmk_id, week, material, method, student_experience, assessment_criteria, weight, created_at, updated_at)
        VALUES (gen_random_uuid(), v_sub_id, v_week, 
                'Materi Minggu ' || v_week || ': Git', 
                'Praktikum Git', 
                'Branching dan merging', 
                'Git workflow', 
                8, NOW(), NOW());
    END LOOP;
    
    -- Sub-CPMK 11: 5 requirements
    INSERT INTO sub_cpmks (id, cpmk_id, sub_cpmk_number, description, created_at, updated_at)
    VALUES (gen_random_uuid(), v_cpmk_id, 'Sub-CPMK-11', 'Mahasiswa mampu melakukan deployment ke cloud', NOW(), NOW())
    RETURNING id INTO v_sub_id;
    
    FOR v_week IN 1..5 LOOP
        INSERT INTO requirements (id, sub_cpmk_id, week, material, method, student_experience, assessment_criteria, weight, created_at, updated_at)
        VALUES (gen_random_uuid(), v_sub_id, v_week, 
                'Materi Minggu ' || v_week || ': Cloud Deployment', 
                'Praktikum Deployment', 
                'Deploy ke cloud platform', 
                'Deployment success', 
                14, NOW(), NOW());
    END LOOP;
    
    -- Sub-CPMK 12: 4 requirements
    INSERT INTO sub_cpmks (id, cpmk_id, sub_cpmk_number, description, created_at, updated_at)
    VALUES (gen_random_uuid(), v_cpmk_id, 'Sub-CPMK-12', 'Mahasiswa mampu mengoptimasi performa aplikasi', NOW(), NOW())
    RETURNING id INTO v_sub_id;
    
    FOR v_week IN 1..4 LOOP
        INSERT INTO requirements (id, sub_cpmk_id, week, material, method, student_experience, assessment_criteria, weight, created_at, updated_at)
        VALUES (gen_random_uuid(), v_sub_id, v_week, 
                'Materi Minggu ' || v_week || ': Performance', 
                'Optimization Workshop', 
                'Code splitting, caching', 
                'Performance metrics', 
                11, NOW(), NOW());
    END LOOP;
    
    -- Sub-CPMK 13: 7 requirements
    INSERT INTO sub_cpmks (id, cpmk_id, sub_cpmk_number, description, created_at, updated_at)
    VALUES (gen_random_uuid(), v_cpmk_id, 'Sub-CPMK-13', 'Mahasiswa mampu menerapkan security best practices', NOW(), NOW())
    RETURNING id INTO v_sub_id;
    
    FOR v_week IN 1..7 LOOP
        INSERT INTO requirements (id, sub_cpmk_id, week, material, method, student_experience, assessment_criteria, weight, created_at, updated_at)
        VALUES (gen_random_uuid(), v_sub_id, v_week, 
                'Materi Minggu ' || v_week || ': Web Security', 
                'Security Workshop', 
                'CORS, XSS prevention', 
                'Security implementation', 
                15, NOW(), NOW());
    END LOOP;
    
    -- Sub-CPMK 14: 6 requirements
    INSERT INTO sub_cpmks (id, cpmk_id, sub_cpmk_number, description, created_at, updated_at)
    VALUES (gen_random_uuid(), v_cpmk_id, 'Sub-CPMK-14', 'Mahasiswa mampu mengimplementasikan real-time features', NOW(), NOW())
    RETURNING id INTO v_sub_id;
    
    FOR v_week IN 1..6 LOOP
        INSERT INTO requirements (id, sub_cpmk_id, week, material, method, student_experience, assessment_criteria, weight, created_at, updated_at)
        VALUES (gen_random_uuid(), v_sub_id, v_week, 
                'Materi Minggu ' || v_week || ': WebSocket', 
                'Real-time Workshop', 
                'Implementasi chat, notifications', 
                'Real-time functionality', 
                12, NOW(), NOW());
    END LOOP;
    
    RAISE NOTICE 'Data berhasil dibuat! 14 Sub-CPMK dengan total 79 requirements';
END $$;

-- Verifikasi
SELECT 
    c.code,
    c.title,
    COUNT(DISTINCT sc.id) as jumlah_sub_cpmk,
    COUNT(r.id) as jumlah_requirements
FROM courses c
LEFT JOIN cpmks cp ON c.id = cp.course_id
LEFT JOIN sub_cpmks sc ON cp.id = sc.cpmk_id
LEFT JOIN requirements r ON sc.id = r.sub_cpmk_id
WHERE c.code = 'IF601'
GROUP BY c.code, c.title;
