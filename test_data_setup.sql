-- Bersihkan data existing
DELETE FROM requirements;
DELETE FROM sub_cpmks;
DELETE FROM cpmks;
DELETE FROM courses;

-- Insert mata kuliah test
INSERT INTO courses (id, code, title, credits, semester, category, tahun, prodi_id, program_id, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'IF101',
    'Pemrograman Web Lanjut',
    3,
    4,
    'Wajib',
    '2024',
    (SELECT id FROM prodis LIMIT 1),
    (SELECT id FROM programs LIMIT 1),
    NOW(),
    NOW()
);

-- Simpan course_id untuk reference
DO $$
DECLARE
    v_course_id UUID;
    v_cpmk_id UUID;
    v_sub_cpmk_ids UUID[];
    i INT;
    j INT;
    req_count INT;
BEGIN
    -- Get course ID
    SELECT id INTO v_course_id FROM courses WHERE code = 'IF101';
    
    -- Insert 1 CPMK
    INSERT INTO cpmks (id, course_id, cpmk_number, description, created_at, updated_at)
    VALUES (
        gen_random_uuid(),
        v_course_id,
        'CPMK-1',
        'Mahasiswa mampu menganalisis, merancang, dan mengimplementasikan aplikasi web modern dengan menggunakan framework terkini serta menerapkan best practices dalam pengembangan perangkat lunak',
        NOW(),
        NOW()
    )
    RETURNING id INTO v_cpmk_id;
    
    -- Insert 16 Sub-CPMK
    FOR i IN 1..16 LOOP
        INSERT INTO sub_cpmks (id, cpmk_id, sub_cpmk_number, description, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            v_cpmk_id,
            'Sub-CPMK-' || i,
            CASE i
                WHEN 1 THEN 'Mahasiswa mampu memahami konsep dasar pengembangan web modern dan arsitektur aplikasi'
                WHEN 2 THEN 'Mahasiswa mampu menerapkan framework frontend (React/Vue) dalam pengembangan aplikasi'
                WHEN 3 THEN 'Mahasiswa mampu mengimplementasikan RESTful API dengan menggunakan Node.js/Go'
                WHEN 4 THEN 'Mahasiswa mampu merancang dan mengimplementasikan database relasional yang efisien'
                WHEN 5 THEN 'Mahasiswa mampu menerapkan autentikasi dan otorisasi dalam aplikasi web'
                WHEN 6 THEN 'Mahasiswa mampu mengintegrasikan frontend dan backend secara seamless'
                WHEN 7 THEN 'Mahasiswa mampu menerapkan state management dalam aplikasi frontend'
                WHEN 8 THEN 'Mahasiswa mampu mengimplementasikan responsive design dan UI/UX yang baik'
                WHEN 9 THEN 'Mahasiswa mampu menerapkan testing (unit test dan integration test)'
                WHEN 10 THEN 'Mahasiswa mampu menggunakan version control (Git) secara efektif'
                WHEN 11 THEN 'Mahasiswa mampu melakukan deployment aplikasi ke cloud platform'
                WHEN 12 THEN 'Mahasiswa mampu mengoptimasi performa aplikasi web'
                WHEN 13 THEN 'Mahasiswa mampu menerapkan security best practices dalam pengembangan web'
                WHEN 14 THEN 'Mahasiswa mampu mengimplementasikan real-time features menggunakan WebSocket'
                WHEN 15 THEN 'Mahasiswa mampu menerapkan CI/CD pipeline dalam development workflow'
                WHEN 16 THEN 'Mahasiswa mampu mendokumentasikan API dan code dengan baik'
            END,
            NOW(),
            NOW()
        )
        RETURNING id INTO v_sub_cpmk_ids[i];
    END LOOP;
    
    -- Insert requirements untuk setiap Sub-CPMK dengan jumlah bervariasi
    -- Sub-CPMK 1: 8 requirements (banyak)
    FOR j IN 1..8 LOOP
        INSERT INTO requirements (id, sub_cpmk_id, week, material, method, student_experience, assessment_criteria, weight, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            v_sub_cpmk_ids[1],
            j,
            'Materi Minggu ' || j || ': Penganalan Web Development Modern',
            'Ceramah, Diskusi, dan Praktikum',
            'Mengikuti kuliah, mengerjakan tugas praktikum',
            'Ketepatan konsep, kualitas implementasi',
            CASE WHEN j <= 4 THEN 15 ELSE 10 END,
            NOW(),
            NOW()
        );
    END LOOP;
    
    -- Sub-CPMK 2: 7 requirements
    FOR j IN 1..7 LOOP
        INSERT INTO requirements (id, sub_cpmk_id, week, material, method, student_experience, assessment_criteria, weight, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            v_sub_cpmk_ids[2],
            j,
            'Materi Minggu ' || j || ': Framework Frontend (React)',
            'Praktikum dan Project-Based Learning',
            'Membuat komponen React, state management',
            'Fungsionalitas komponen, code quality',
            12,
            NOW(),
            NOW()
        );
    END LOOP;
    
    -- Sub-CPMK 3: 6 requirements
    FOR j IN 1..6 LOOP
        INSERT INTO requirements (id, sub_cpmk_id, week, material, method, student_experience, assessment_criteria, weight, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            v_sub_cpmk_ids[3],
            j,
            'Materi Minggu ' || j || ': RESTful API Development',
            'Praktikum dan Case Study',
            'Membangun API endpoints, handling requests',
            'Struktur API, error handling',
            13,
            NOW(),
            NOW()
        );
    END LOOP;
    
    -- Sub-CPMK 4: 5 requirements
    FOR j IN 1..5 LOOP
        INSERT INTO requirements (id, sub_cpmk_id, week, material, method, student_experience, assessment_criteria, weight, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            v_sub_cpmk_ids[4],
            j,
            'Materi Minggu ' || j || ': Database Design dan Implementation',
            'Praktikum Database',
            'Merancang schema, membuat queries',
            'Efisiensi query, normalisasi',
            14,
            NOW(),
            NOW()
        );
    END LOOP;
    
    -- Sub-CPMK 5: 5 requirements
    FOR j IN 1..5 LOOP
        INSERT INTO requirements (id, sub_cpmk_id, week, material, method, student_experience, assessment_criteria, weight, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            v_sub_cpmk_ids[5],
            j,
            'Materi Minggu ' || j || ': Authentication & Authorization',
            'Praktikum Security',
            'Implementasi JWT, role-based access',
            'Security implementation, token management',
            15,
            NOW(),
            NOW()
        );
    END LOOP;
    
    -- Sub-CPMK 6: 4 requirements
    FOR j IN 1..4 LOOP
        INSERT INTO requirements (id, sub_cpmk_id, week, material, method, student_experience, assessment_criteria, weight, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            v_sub_cpmk_ids[6],
            j,
            'Materi Minggu ' || j || ': Frontend-Backend Integration',
            'Project Integration',
            'Menghubungkan frontend dengan API',
            'Data flow, error handling',
            11,
            NOW(),
            NOW()
        );
    END LOOP;
    
    -- Sub-CPMK 7: 6 requirements
    FOR j IN 1..6 LOOP
        INSERT INTO requirements (id, sub_cpmk_id, week, material, method, student_experience, assessment_criteria, weight, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            v_sub_cpmk_ids[7],
            j,
            'Materi Minggu ' || j || ': State Management (Redux/Context)',
            'Praktikum State Management',
            'Implementasi global state, reducers',
            'State management pattern, optimization',
            12,
            NOW(),
            NOW()
        );
    END LOOP;
    
    -- Sub-CPMK 8: 5 requirements
    FOR j IN 1..5 LOOP
        INSERT INTO requirements (id, sub_cpmk_id, week, material, method, student_experience, assessment_criteria, weight, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            v_sub_cpmk_ids[8],
            j,
            'Materi Minggu ' || j || ': Responsive Design & UI/UX',
            'Design Workshop',
            'Membuat responsive layout, UI components',
            'Responsiveness, user experience',
            10,
            NOW(),
            NOW()
        );
    END LOOP;
    
    -- Sub-CPMK 9: 4 requirements
    FOR j IN 1..4 LOOP
        INSERT INTO requirements (id, sub_cpmk_id, week, material, method, student_experience, assessment_criteria, weight, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            v_sub_cpmk_ids[9],
            j,
            'Materi Minggu ' || j || ': Testing (Unit & Integration)',
            'Praktikum Testing',
            'Menulis unit tests, integration tests',
            'Test coverage, test quality',
            13,
            NOW(),
            NOW()
        );
    END LOOP;
    
    -- Sub-CPMK 10: 3 requirements (sedikit)
    FOR j IN 1..3 LOOP
        INSERT INTO requirements (id, sub_cpmk_id, week, material, method, student_experience, assessment_criteria, weight, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            v_sub_cpmk_ids[10],
            j,
            'Materi Minggu ' || j || ': Version Control dengan Git',
            'Praktikum Git',
            'Branching, merging, pull requests',
            'Git workflow, collaboration',
            8,
            NOW(),
            NOW()
        );
    END LOOP;
    
    -- Sub-CPMK 11: 5 requirements
    FOR j IN 1..5 LOOP
        INSERT INTO requirements (id, sub_cpmk_id, week, material, method, student_experience, assessment_criteria, weight, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            v_sub_cpmk_ids[11],
            j,
            'Materi Minggu ' || j || ': Cloud Deployment',
            'Praktikum Deployment',
            'Deploy ke Vercel/Netlify/AWS',
            'Deployment success, configuration',
            14,
            NOW(),
            NOW()
        );
    END LOOP;
    
    -- Sub-CPMK 12: 4 requirements
    FOR j IN 1..4 LOOP
        INSERT INTO requirements (id, sub_cpmk_id, week, material, method, student_experience, assessment_criteria, weight, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            v_sub_cpmk_ids[12],
            j,
            'Materi Minggu ' || j || ': Performance Optimization',
            'Optimization Workshop',
            'Code splitting, lazy loading, caching',
            'Load time, performance metrics',
            11,
            NOW(),
            NOW()
        );
    END LOOP;
    
    -- Sub-CPMK 13: 7 requirements
    FOR j IN 1..7 LOOP
        INSERT INTO requirements (id, sub_cpmk_id, week, material, method, student_experience, assessment_criteria, weight, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            v_sub_cpmk_ids[13],
            j,
            'Materi Minggu ' || j || ': Web Security Best Practices',
            'Security Workshop',
            'CORS, XSS prevention, SQL injection',
            'Security implementation, vulnerability check',
            15,
            NOW(),
            NOW()
        );
    END LOOP;
    
    -- Sub-CPMK 14: 6 requirements
    FOR j IN 1..6 LOOP
        INSERT INTO requirements (id, sub_cpmk_id, week, material, method, student_experience, assessment_criteria, weight, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            v_sub_cpmk_ids[14],
            j,
            'Materi Minggu ' || j || ': Real-time Features (WebSocket)',
            'Real-time Workshop',
            'Implementasi chat, notifications',
            'Real-time functionality, connection handling',
            12,
            NOW(),
            NOW()
        );
    END LOOP;
    
    -- Sub-CPMK 15: 5 requirements
    FOR j IN 1..5 LOOP
        INSERT INTO requirements (id, sub_cpmk_id, week, material, method, student_experience, assessment_criteria, weight, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            v_sub_cpmk_ids[15],
            j,
            'Materi Minggu ' || j || ': CI/CD Pipeline',
            'DevOps Workshop',
            'Setup GitHub Actions, automated testing',
            'Pipeline configuration, automation',
            13,
            NOW(),
            NOW()
        );
    END LOOP;
    
    -- Sub-CPMK 16: 4 requirements
    FOR j IN 1..4 LOOP
        INSERT INTO requirements (id, sub_cpmk_id, week, material, method, student_experience, assessment_criteria, weight, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            v_sub_cpmk_ids[16],
            j,
            'Materi Minggu ' || j || ': API Documentation',
            'Documentation Workshop',
            'Menulis API docs, code comments',
            'Documentation clarity, completeness',
            9,
            NOW(),
            NOW()
        );
    END LOOP;
    
    RAISE NOTICE 'Data berhasil dibuat! Total: 16 Sub-CPMK dengan 89 requirements';
END $$;

-- Verifikasi data
SELECT 
    c.title as mata_kuliah,
    COUNT(DISTINCT sc.id) as jumlah_sub_cpmk,
    COUNT(r.id) as jumlah_requirements
FROM courses c
LEFT JOIN cpmks cp ON c.id = cp.course_id
LEFT JOIN sub_cpmks sc ON cp.id = sc.cpmk_id
LEFT JOIN requirements r ON sc.id = r.sub_cpmk_id
WHERE c.code = 'IF101'
GROUP BY c.title;
