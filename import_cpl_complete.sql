-- Import CPL dan Indikator Kinerja dari IK-CPL.csv
-- Program Studi: S1-INFORMATIKA (S1-TI)  
-- Total: 10 CPL dengan 4 indikator kinerja masing-masing

DO $$
DECLARE
    v_prodi_id uuid;
    v_cpl_id uuid;
BEGIN
    -- Get prodi S1-TI
    SELECT id INTO v_prodi_id FROM prodis WHERE kode_prodi = 'S1-TI' LIMIT 1;
    
    IF v_prodi_id IS NULL THEN
        RAISE NOTICE 'Prodi S1-TI not found. Please create it first!';
    ELSE
        -- CPL-01: Pengetahuan Umum
        INSERT INTO cpl (id, prodi_id, kode_cpl, komponen, cpl, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            v_prodi_id,
            'CPL-01',
            'Pengetahuan Umum',
            'Mampu menerapkan pengetahuan matematika, ilmu alam, dan teknologi informasi untuk memahami prinsip-prinsip dasar teknik sumber daya air',
            NOW(),
            NOW()
        ) RETURNING id INTO v_cpl_id;

        INSERT INTO cpl_indikator (cpl_id, indikator_kerja, urutan) VALUES
        (v_cpl_id, 'Mahasiswa mampu menjelaskan konsep-konsep dasar matematika yang diperlukan dalam analisis teknik dasar air', 1),
        (v_cpl_id, 'Mahasiswa mampu menerapkan prinsip fisika dan kimia untuk memahami proses-proses di lingkungan', 2),
        (v_cpl_id, 'Mahasiswa mampu menggunakan konsep ilmu alam untuk memahami proses-proses di lingkungan', 3),
        (v_cpl_id, 'Mahasiswa dapat menerapkan pengetahuan kuantitatif dalam pemecahan masalah sederhana pada bidang sumber daya air', 4);

        -- CPL-02: Keterampilan Khusus
        INSERT INTO cpl (id, prodi_id, kode_cpl, komponen, cpl, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            v_prodi_id,
            'CPL-02',
            'Keterampilan Khusus',
            'Mampu merancang sistem jaringan bangunan air dengan mempertimbangkan aspek hukum, ekonomi, lingkungan, sosial, politik, kesehatan dan keselamatan, serta keberlanjutan, serta mengenali dan/atau memanfaatkan potensi sumber daya lokal dan nasional dengan perspektif global',
            NOW(),
            NOW()
        ) RETURNING id INTO v_cpl_id;

        INSERT INTO cpl_indikator (cpl_id, indikator_kerja, urutan) VALUES
        (v_cpl_id, 'Mahasiswa mampu mengidentifikasi kebutuhan dan tujuan perancangan sistem jaringan bangunan air berdasarkan kondisi lapangan', 1),
        (v_cpl_id, 'Mahasiswa mampu merancang sistem yang berorientasi pada keberlanjutan dengan mempertimbangkan efisiensi air, energi, dampak jangka panjang, dan kesehatan kita', 2),
        (v_cpl_id, 'Mahasiswa mampu menghasilkan alternatif desain jaringan bangunan air yang memenuhi persyaratan teknis eksekusi', 3),
        (v_cpl_id, 'Mahasiswa mampu melakukan aspek hukum, ekonomi, lingkungan, sosial, dan politik', 4);

        -- CPL-03: Keterampilan Khusus
        INSERT INTO cpl (id, prodi_id, kode_cpl, komponen, cpl, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            v_prodi_id,
            'CPL-03',
            'Keterampilan Khusus',
            'Mampu merancang dan melakukan eksperimen laboratorium maupun pengamatan lapangan serta mampu menganalisis dan menginterpretasikan data untuk mendukung penilaian teknik sumber daya air',
            NOW(),
            NOW()
        ) RETURNING id INTO v_cpl_id;

        INSERT INTO cpl_indikator (cpl_id, indikator_kerja, urutan) VALUES
        (v_cpl_id, 'Mahasiswa mampu merumuskan prosedur dan standar nasional dalam perancangan serta membandingkan dengan praktik dan referensi internasional', 1),
        (v_cpl_id, 'Mahasiswa mampu merancang dan melaksir nilai sehingga dapat dihitung besaran observasi yang sesuai', 2),
        (v_cpl_id, 'Mahasiswa mampu menggunakan dan mencatat data secara akurat menggunakan instrumen, pengukuran dan benar observasi yang sesuai', 3),
        (v_cpl_id, 'Mahasiswa mampu melakukan pengolahan data (statistik, grafik, model numerik, analisis dimensi) serta menafsirkan hasil untuk mendukung kesimpulan teknis', 4);

        -- CPL-04: Keterampilan Khusus
        INSERT INTO cpl (id, prodi_id, kode_cpl, komponen, cpl, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            v_prodi_id,
            'CPL-04',
            'Keterampilan Khusus',
            'Mampu mengidentifikasi, merumuskan, menganalisis, dan memecahkan permasalahan kompleks di bidang teknik sumber daya air',
            NOW(),
            NOW()
        ) RETURNING id INTO v_cpl_id;

        INSERT INTO cpl_indikator (cpl_id, indikator_kerja, urutan) VALUES
        (v_cpl_id, 'Mahasiswa mampu mengidentifikasi masalah teknis sumber daya air dan merumuskan pertanyaan berdasarkan data dan fenomena lapangan', 1),
        (v_cpl_id, 'Mahasiswa mampu menganalisis permasalahan teknik dengan metode ilmiah dan alat analisis yang sesuai', 2),
        (v_cpl_id, 'Mahasiswa mampu merumuskan solusi alternatif berdasarkan analisis teknis, ekonomi, sosial, dan lingkungan', 3),
        (v_cpl_id, 'Mahasiswa mampu mengevaluasi dan memilih solusi terbaik dengan mempertimbangkan keberlanjutan dan dampak jangka panjang', 4);

        -- CPL-05: Keterampilan Khusus
        INSERT INTO cpl (id, prodi_id, kode_cpl, komponen, cpl, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            v_prodi_id,
            'CPL-05',
            'Keterampilan Khusus',
            'Mampu menerapkan metode, keterampilan, dan alat rekayasa modern dalam praktik teknik sumber daya air',
            NOW(),
            NOW()
        ) RETURNING id INTO v_cpl_id;

        INSERT INTO cpl_indikator (cpl_id, indikator_kerja, urutan) VALUES
        (v_cpl_id, 'Mahasiswa mampu mengoperasikan peralatan survei, instrumentasi, software analisis/hidrolika/hidrologi, serta standar teknis (SNI, Permen, pedoman nasional) yang relevan dalam pelaksanaan kegiatan KKP', 1),
        (v_cpl_id, 'Mahasiswa mampu menggunakan perangkat lunak untuk analisis hidrologi, hidrolika, kualitas air, dan pemodelan sistem air', 2),
        (v_cpl_id, 'Mahasiswa mampu menerapkan metode numerik dan komputasi untuk menyelesaikan masalah teknik sumber daya air', 3),
        (v_cpl_id, 'Mahasiswa mampu menginterpretasikan dan memvalidasi hasil analisis digital dengan data lapangan atau referensi teknis', 4);

        -- CPL-06: Keterampilan Umum
        INSERT INTO cpl (id, prodi_id, kode_cpl, komponen, cpl, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            v_prodi_id,
            'CPL-06',
            'Keterampilan Umum',
            'Mampu berkomunikasi secara efektif baik secara lisan dan tertulis dalam menyampaikan ide maupun hasil analisis',
            NOW(),
            NOW()
        ) RETURNING id INTO v_cpl_id;

        INSERT INTO cpl_indikator (cpl_id, indikator_kerja, urutan) VALUES
        (v_cpl_id, 'Mahasiswa mampu menyusun laporan teknis yang logis, sistematis, dan sesuai dengan kaidah penulisan akademik', 1),
        (v_cpl_id, 'Mahasiswa mampu mempresentasikan hasil analisis, rancangan, atau penelitian secara lisan dengan jelas dan persuasif', 2),
        (v_cpl_id, 'Mahasiswa mampu menggunakan media visual (grafik, tabel, diagram, gambar teknik) untuk mendukung komunikasi teknis', 3),
        (v_cpl_id, 'Mahasiswa mampu berkomunikasi efektif dengan berbagai pihak, termasuk masyarakat awam, rekan sejawat, dan pemangku kepentingan', 4);

        -- CPL-07: Keterampilan Umum
        INSERT INTO cpl (id, prodi_id, kode_cpl, komponen, cpl, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            v_prodi_id,
            'CPL-07',
            'Keterampilan Umum',
            'Mampu merencanakan, melaksanakan, dan mengevaluasi tugas Teknik sumber daya air sesuai dengan batasan yang tersedia',
            NOW(),
            NOW()
        ) RETURNING id INTO v_cpl_id;

        INSERT INTO cpl_indikator (cpl_id, indikator_kerja, urutan) VALUES
        (v_cpl_id, 'Mahasiswa mampu menyusun rencana kerja yang sistematis dengan mengidentifikasi tugas, sumber daya, waktu, dan batasan teknis', 1),
        (v_cpl_id, 'Mahasiswa mampu melaksanakan tugas sesuai rencana dengan menggunakan metode yang tepat dan mengelola waktu secara efektif', 2),
        (v_cpl_id, 'Mahasiswa mampu mengevaluasi hasil pelaksanaan tugas berdasarkan kriteria teknis dan mengidentifikasi perbaikan yang diperlukan', 3),
        (v_cpl_id, 'Mahasiswa mampu beradaptasi terhadap perubahan kondisi dan kendala selama pelaksanaan tugas dengan solusi yang rasional', 4);

        -- CPL-08: Keterampilan Umum
        INSERT INTO cpl (id, prodi_id, kode_cpl, komponen, cpl, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            v_prodi_id,
            'CPL-08',
            'Keterampilan Umum',
            'Mampu bekerja dalam tim multidisiplin dan multikultural',
            NOW(),
            NOW()
        ) RETURNING id INTO v_cpl_id;

        INSERT INTO cpl_indikator (cpl_id, indikator_kerja, urutan) VALUES
        (v_cpl_id, 'Mahasiswa mampu berperan aktif dalam tim, menghargai pendapat anggota lain, dan berkontribusi sesuai peran yang diberikan', 1),
        (v_cpl_id, 'Mahasiswa mampu berkolaborasi dengan anggota tim dari berbagai latar belakang disiplin ilmu dan budaya', 2),
        (v_cpl_id, 'Mahasiswa mampu menyelesaikan konflik dalam tim secara konstruktif dan mencapai konsensus untuk tujuan bersama', 3),
        (v_cpl_id, 'Mahasiswa mampu memimpin atau mendukung kepemimpinan tim dalam mencapai target proyek atau tugas kolektif', 4);

        -- CPL-09: Sikap
        INSERT INTO cpl (id, prodi_id, kode_cpl, komponen, cpl, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            v_prodi_id,
            'CPL-09',
            'Sikap',
            'Mampu bertanggung jawab secara profesional dan mematuhi etika profesional terhadap masyarakat dalam merancang dan mengelola infrastruktur Teknik sumber daya air yang aman',
            NOW(),
            NOW()
        ) RETURNING id INTO v_cpl_id;

        INSERT INTO cpl_indikator (cpl_id, indikator_kerja, urutan) VALUES
        (v_cpl_id, 'Mahasiswa mampu memahami dan menerapkan kode etik profesi teknik sipil/sumber daya air dalam setiap kegiatan akademik dan profesional', 1),
        (v_cpl_id, 'Mahasiswa mampu mengidentifikasi dan mengevaluasi dampak sosial, ekonomi, dan lingkungan dari keputusan teknis yang diambil', 2),
        (v_cpl_id, 'Mahasiswa mampu bertanggung jawab terhadap keamanan, kesehatan, dan keberlanjutan infrastruktur yang dirancang atau dikelola', 3),
        (v_cpl_id, 'Mahasiswa mampu menunjukkan integritas, kejujuran, dan transparansi dalam praktik profesional dan akademik', 4);

        -- CPL-10: Sikap
        INSERT INTO cpl (id, prodi_id, kode_cpl, komponen, cpl, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            v_prodi_id,
            'CPL-10',
            'Sikap',
            'Mampu menyadari pentingnya pembelajaran sepanjang hayat dengan menerapkan Al Islam Kemuhammadiyahan dan terus mengakses pengetahuan terbaru dan isu yang sejalan dengan perkembangan zaman di bidang sumber daya air',
            NOW(),
            NOW()
        ) RETURNING id INTO v_cpl_id;

        INSERT INTO cpl_indikator (cpl_id, indikator_kerja, urutan) VALUES
        (v_cpl_id, 'Mahasiswa mampu menunjukkan kesadaran akan pentingnya pembelajaran berkelanjutan untuk mengikuti perkembangan ilmu dan teknologi', 1),
        (v_cpl_id, 'Mahasiswa mampu mengakses dan memanfaatkan sumber pengetahuan terbaru (jurnal, konferensi, pelatihan, teknologi) di bidang sumber daya air', 2),
        (v_cpl_id, 'Mahasiswa mampu mengintegrasikan nilai-nilai Al Islam Kemuhammadiyahan (amanah, ikhlas, profesional, inovatif) dalam praktik akademik dan kehidupan', 3),
        (v_cpl_id, 'Mahasiswa mampu beradaptasi dengan perubahan dan tantangan baru serta terus meningkatkan kompetensi diri secara mandiri', 4);

        RAISE NOTICE '✓ Successfully imported 10 CPL with 40 indikator kinerja for S1-TI';
    END IF;
END $$;

-- Verify import
SELECT 
    c.kode_cpl, 
    c.komponen, 
    LEFT(c.cpl, 50) || '...' as cpl,
    COUNT(i.id) as jumlah_indikator
FROM cpl c
LEFT JOIN cpl_indikator i ON c.id = i.cpl_id
GROUP BY c.id, c.kode_cpl, c.komponen, c.cpl
ORDER BY c.kode_cpl;

SELECT 'Total CPL: ' || COUNT(*) FROM cpl;
SELECT 'Total Indikator: ' || COUNT(*) FROM cpl_indikator;
