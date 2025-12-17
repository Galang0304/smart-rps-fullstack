-- Import CPL dan Indikator Kinerja dari IK-CPL.csv
-- Program Studi: S1-INFORMATIKA (S1-TI)
-- Total: 10 CPL dengan indikator kinerjanya

-- Pastikan prodi S1-INFORMATIKA sudah ada
DO $$
DECLARE
    v_prodi_id uuid;
BEGIN
    -- Get prodi S1-TI
    SELECT id INTO v_prodi_id FROM prodis WHERE kode_prodi = 'S1-TI' LIMIT 1;
    
    IF v_prodi_id IS NULL THEN
        RAISE NOTICE 'Prodi S1-TI not found. Please create it first!';
    ELSE
        -- CPL-01: Pengetahuan Umum
        INSERT INTO cpl (prodi_id, kode_cpl, komponen, deskripsi, created_at, updated_at)
        VALUES (
            v_prodi_id,
            'CPL-01',
            'Pengetahuan Umum',
            'Mampu menerapkan pengetahuan matematika, ilmu alam, dan teknologi informasi untuk memahami prinsip-prinsip dasar teknik sumber daya air.',
            NOW(),
            NOW()
        );

        -- CPL-02: Keterampilan Khusus
        INSERT INTO cpl (prodi_id, kode_cpl, komponen, deskripsi, created_at, updated_at)
        VALUES (
            v_prodi_id,
            'CPL-02',
            'Keterampilan Khusus',
            'Mampu merancang sistem jaringan bangunan air dengan mempertimbangkan aspek hukum, ekonomi, lingkungan, sosial, politik, kesehatan dan keselamatan, serta keberlanjutan, serta mengenali dan/atau memanfaatkan potensi sumber daya local dan nasional dengan perspektif global.',
            NOW(),
            NOW()
        );

        -- CPL-03: Keterampilan Khusus
        INSERT INTO cpl (prodi_id, kode_cpl, komponen, deskripsi, created_at, updated_at)
        VALUES (
            v_prodi_id,
            'CPL-03',
            'Keterampilan Khusus',
            'Mampu merancang dan melakukan eksperimen laboratorium maupun pengamatan lapangan serta mampu menganalisis dan menginterpretasikan data untuk mendukung penilaian teknik sumber daya air.',
            NOW(),
            NOW()
        );

        -- CPL-04: Keterampilan Khusus
        INSERT INTO cpl (prodi_id, kode_cpl, komponen, deskripsi, created_at, updated_at)
        VALUES (
            v_prodi_id,
            'CPL-04',
            'Keterampilan Khusus',
            'Mampu mengidentifikasi, merumuskan, menganalisis, dan memecahkan permasalahan kompleks di bidang teknik sumber daya air.',
            NOW(),
            NOW()
        );

        -- CPL-05: Keterampilan Khusus
        INSERT INTO cpl (prodi_id, kode_cpl, komponen, deskripsi, created_at, updated_at)
        VALUES (
            v_prodi_id,
            'CPL-05',
            'Keterampilan Khusus',
            'Mampu menerapkan metode, keterampilan, dan alat rekayasa modern dalam praktik teknik sumber daya air.',
            NOW(),
            NOW()
        );

        -- CPL-06: Keterampilan Umum
        INSERT INTO cpl (prodi_id, kode_cpl, komponen, deskripsi, created_at, updated_at)
        VALUES (
            v_prodi_id,
            'CPL-06',
            'Keterampilan Umum',
            'Mampu berkomunikasi secara efektif baik secara lisan dan tertulis dalam menyampaikan ide maupun hasil analisis.',
            NOW(),
            NOW()
        );

        -- CPL-07: Keterampilan Umum
        INSERT INTO cpl (prodi_id, kode_cpl, komponen, deskripsi, created_at, updated_at)
        VALUES (
            v_prodi_id,
            'CPL-07',
            'Keterampilan Umum',
            'Mampu merencanakan, melaksanakan, dan mengevaluasi tugas Teknik sumber daya air sesuai dengan batasan yang tersedia.',
            NOW(),
            NOW()
        );

        -- CPL-08: Keterampilan Umum
        INSERT INTO cpl (prodi_id, kode_cpl, komponen, deskripsi, created_at, updated_at)
        VALUES (
            v_prodi_id,
            'CPL-08',
            'Keterampilan Umum',
            'Mampu bekerja dalam tim multidisiplin dan multicultural.',
            NOW(),
            NOW()
        );

        -- CPL-09: Sikap
        INSERT INTO cpl (prodi_id, kode_cpl, komponen, deskripsi, created_at, updated_at)
        VALUES (
            v_prodi_id,
            'CPL-09',
            'Sikap',
            'Mampu bertanggung jawab secara profesional dan mematuhi etika profesional terhadap masyarakat dalam merancang dan mengelola infrastruktur Teknik sumber daya air yang aman.',
            NOW(),
            NOW()
        );

        -- CPL-10: Sikap
        INSERT INTO cpl (prodi_id, kode_cpl, komponen, deskripsi, created_at, updated_at)
        VALUES (
            v_prodi_id,
            'CPL-10',
            'Sikap',
            'Mampu menyadari pentingnya pembelajaran sepanjang hayat dengan menerapkan Al Islam Kemuhammadiyahan dan terus mengakses pengetahuan terbaru dan isu yang sejalan dengan perkembangan zaman di bidang sumber daya air.',
            NOW(),
            NOW()
        );

        RAISE NOTICE '✓ Successfully imported 10 CPL for S1-TI';
    END IF;
END $$;

-- Verify import
SELECT COUNT(*) as total_cpl FROM cpl;
SELECT kode_cpl, komponen, LEFT(deskripsi, 60) || '...' as deskripsi FROM cpl ORDER BY kode_cpl;
