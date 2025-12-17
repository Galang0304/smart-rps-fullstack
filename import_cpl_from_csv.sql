-- Import CPL dan Indikator Kinerja dari IK-CPL.csv (SESUAI DATA ASLI)
-- Program Studi: S1-INFORMATIKA (S1-TI)  
-- Total: 10 CPL dengan 41 indikator kinerja (jumlah berbeda-beda per CPL)

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
        -- Delete existing data first
        DELETE FROM cpl_indikator WHERE cpl_id IN (SELECT id FROM cpl WHERE prodi_id = v_prodi_id);
        DELETE FROM cpl WHERE prodi_id = v_prodi_id;

        -- CPL-01: Pengetahuan Umum (4 indikator)
        INSERT INTO cpl (id, prodi_id, kode_cpl, komponen, cpl, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            v_prodi_id,
            'CPL-01',
            'Pengetahuan Umum',
            'Mampu menerapkan pengetahuan matematika, ilmu alam, dan teknologi informasi untuk memahami prinsip-prinsip dasar teknik sumber daya air.',
            NOW(),
            NOW()
        ) RETURNING id INTO v_cpl_id;

        INSERT INTO cpl_indikator (cpl_id, indikator_kerja, urutan) VALUES
        (v_cpl_id, 'Mahasiswa mampu menjelaskan konsep-konsep dasar matematika  yang diperlukan dalam analisis sistem sumber daya air.', 1),
        (v_cpl_id, 'Mahasiswa mampu menerapkan prinsip fisika dan kimia untuk menjelaskan fenomena air, seperti sifat fluida, perubahan fase, dan interaksi air–material.', 2),
        (v_cpl_id, 'Mahasiswa mampu mengaplikasikan konsep ilmu alam untuk memahami proses-proses di lingkungan', 3),
        (v_cpl_id, 'Mahasiswa dapat menerapkan pendekatan kuantitatif dalam pemecahan masalah sederhana pada bidang sumber daya air.', 4);

        -- CPL-02: Keterampilan Khusus (4 indikator)
        INSERT INTO cpl (id, prodi_id, kode_cpl, komponen, cpl, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            v_prodi_id,
            'CPL-02',
            'Keterampilan Khusus',
            'Mampu merancang sistem jaringan bangunan air dengan mempertimbangkan aspek hukum, ekonomi, lingkungan, sosial, politik, kesehatan dan keselamatan, serta keberlanjutan, serta mengenali dan/atau memanfaatkan potensi sumber daya local dan nasional dengan perspektif global.',
            NOW(),
            NOW()
        ) RETURNING id INTO v_cpl_id;

        INSERT INTO cpl_indikator (cpl_id, indikator_kerja, urutan) VALUES
        (v_cpl_id, 'Mahasiswa mampu mengidentifikasi kebutuhan dan tujuan perancangan sistem jaringan bangunan air berdasarkan kondisi lapangan dan data teknis.', 1),
        (v_cpl_id, 'Mahasiswa mampu merancang sistem yang berorientasi pada keberlanjutan dengan mempertimbangkan efisiensi air, energi, dampak jangka panjang, dan ketahanan iklim.', 2),
        (v_cpl_id, 'Mahasiswa mampu menghasilkan alternatif desain jaringan bangunan air yang memenuhi persyaratan teknis sekaligus seimbang dalam aspek hukum, ekonomi, lingkungan, sosial, dan politik.', 3),
        (v_cpl_id, 'Mahasiswa mampu mempertimbangkan potensi dan standar nasional dalam perencanaan, serta membandingkan dengan praktik dan referensi internasional.', 4);

        -- CPL-03: Keterampilan Khusus (5 indikator)
        INSERT INTO cpl (id, prodi_id, kode_cpl, komponen, cpl, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            v_prodi_id,
            'CPL-03',
            'Keterampilan Khusus',
            'Mampu merancang dan melakukan eksperimen laboratorium maupun pengamatan lapangan serta mampu menganalisis dan menginterpretasikan data untuk mendukung penilaian teknik sumber daya air.',
            NOW(),
            NOW()
        ) RETURNING id INTO v_cpl_id;

        INSERT INTO cpl_indikator (cpl_id, indikator_kerja, urutan) VALUES
        (v_cpl_id, 'Mahasiswa mampu melakukan pengukuran lapangan (debit, kualitas air, geometri saluran, permeabilitas tanah, curah hujan, muka air tanah) dengan metode yang benar.', 1),
        (v_cpl_id, 'Mahasiswa mampu mengumpulkan dan mencatat data secara akurat menggunakan instrumen pengukuran dan lembar observasi yang sesuai.', 2),
        (v_cpl_id, 'Mahasiswa mampu melakukan pengolahan data (statistik dasar, regresi, kalibrasi, analisis grafik) menggunakan software atau alat analisis numerik.', 3),
        (v_cpl_id, 'Mahasiswa mampu menginterpretasikan data secara ilmiah untuk menyimpulkan kondisi sistem sumber daya air atau menjawab tujuan penelitian/perancangan.', 4),
        (v_cpl_id, 'Mahasiswa mampu menganalisis hasil eksperimen atau pengamatan untuk mengevaluasi fenomena hidrologi atau hidraulika.', 5);

        -- CPL-04: Keterampilan Khusus (4 indikator)
        INSERT INTO cpl (id, prodi_id, kode_cpl, komponen, cpl, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            v_prodi_id,
            'CPL-04',
            'Keterampilan Khusus',
            'Mampu mengidentifikasi, merumuskan, menganalisis, dan memecahkan permasalahan kompleks di bidang teknik sumber daya air.',
            NOW(),
            NOW()
        ) RETURNING id INTO v_cpl_id;

        INSERT INTO cpl_indikator (cpl_id, indikator_kerja, urutan) VALUES
        (v_cpl_id, 'Mahasiswa mampu mengidentifikasi permasalahan kompleks terkait hidrologi, hidraulika, pengelolaan air, lingkungan air, atau bangunan air berdasarkan data lapangan, studi literatur, atau fenomena aktual.', 1),
        (v_cpl_id, 'Mahasiswa mampu melakukan analisis data dan informasi teknis menggunakan metode kuantitatif maupun kualitatif untuk memahami akar masalah.', 2),
        (v_cpl_id, 'Mahasiswa mampu memvalidasi hasil analisis atau pemodelan dengan membandingkan terhadap data lapangan, hasil eksperimen, atau referensi teknis yang tersedia.', 3),
        (v_cpl_id, 'Mahasiswa mampu merumuskan masalah secara jelas dan spesifik, termasuk batasan (constraints), asumsi, variabel, dan tujuan pemecahan masalah.', 4);

        -- CPL-05: Keterampilan Khusus (4 indikator)
        INSERT INTO cpl (id, prodi_id, kode_cpl, komponen, cpl, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            v_prodi_id,
            'CPL-05',
            'Keterampilan Khusus',
            'Mampu menerapkan metode, keterampilan, dan alat rekayasa modern dalam praktik teknik sumber daya air.',
            NOW(),
            NOW()
        ) RETURNING id INTO v_cpl_id;

        INSERT INTO cpl_indikator (cpl_id, indikator_kerja, urutan) VALUES
        (v_cpl_id, 'Mahasiswa mampu melakukan pemodelan hidrologi dan hidraulika menggunakan metode modern, termasuk simulasi aliran, banjir, jaringan pipa, atau kualitas air.', 1),
        (v_cpl_id, 'Mahasiswa mampu menggunakan perangkat lunak teknis seperti HEC-RAS, HEC-HMS, EPANET, SWMM, ArcGIS/QGIS, atau CFD tools untuk menyelesaikan permasalahan sumber daya air.', 2),
        (v_cpl_id, 'Mahasiswa mampu memilih metode analisis atau alat rekayasa yang tepat berdasarkan karakteristik permasalahan teknik sumber daya air.', 3),
        (v_cpl_id, 'Mahasiswa mampu menerapkan prinsip efisiensi dan efektivitas dalam penggunaan perangkat lunak dan alat rekayasa modern.', 4);

        -- CPL-06: Keterampilan Umum (3 indikator)
        INSERT INTO cpl (id, prodi_id, kode_cpl, komponen, cpl, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            v_prodi_id,
            'CPL-06',
            'Keterampilan Umum',
            'Mampu berkomunikasi secara efektif baik secara lisan dan tertulis dalam menyampaikan ide maupun hasil analisis.',
            NOW(),
            NOW()
        ) RETURNING id INTO v_cpl_id;

        INSERT INTO cpl_indikator (cpl_id, indikator_kerja, urutan) VALUES
        (v_cpl_id, 'Mahasiswa mampu menyusun laporan teknis, makalah, atau dokumen ilmiah dengan struktur yang sistematis, bahasa yang jelas, dan sesuai standar penulisan akademik/profesional.', 1),
        (v_cpl_id, 'Mahasiswa mampu menggunakan media komunikasi modern untuk mendukung penyampaian informasi secara efektif.', 2),
        (v_cpl_id, 'Mahasiswa mampu menggunakan bahasa Indonesia yang baik dan benar serta bahasa Inggris teknis yang memadai untuk keperluan akademik dan profesional.', 3);

        -- CPL-07: Keterampilan Umum (4 indikator)
        INSERT INTO cpl (id, prodi_id, kode_cpl, komponen, cpl, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            v_prodi_id,
            'CPL-07',
            'Keterampilan Umum',
            'Mampu merencanakan, melaksanakan, dan mengevaluasi tugas Teknik sumber daya air sesuai dengan batasan yang tersedia.',
            NOW(),
            NOW()
        ) RETURNING id INTO v_cpl_id;

        INSERT INTO cpl_indikator (cpl_id, indikator_kerja, urutan) VALUES
        (v_cpl_id, 'Mahasiswa mampu mengidentifikasi tujuan dan ruang lingkup tugas teknik sumber daya air secara jelas sesuai batasan waktu, data, biaya, dan sumber daya.', 1),
        (v_cpl_id, 'Mahasiswa mampu menyusun rencana kerja yang sistematis, termasuk penjadwalan, pembagian tugas, dan identifikasi kebutuhan teknis dalam penyelesaian pekerjaan.', 2),
        (v_cpl_id, 'Mahasiswa mampu mengevaluasi hasil pekerjaan untuk memastikan kesesuaian dengan standar teknis, tujuan awal, dan batasan yang ditetapkan.', 3),
        (v_cpl_id, 'Mahasiswa mampu memberikan rekomendasi perbaikan berdasarkan hasil evaluasi teknis dan pertimbangan praktis.', 4);

        -- CPL-08: Keterampilan Umum (4 indikator)
        INSERT INTO cpl (id, prodi_id, kode_cpl, komponen, cpl, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            v_prodi_id,
            'CPL-08',
            'Keterampilan Umum',
            'Mampu bekerja dalam tim multidisiplin dan multicultural.',
            NOW(),
            NOW()
        ) RETURNING id INTO v_cpl_id;

        INSERT INTO cpl_indikator (cpl_id, indikator_kerja, urutan) VALUES
        (v_cpl_id, 'Mahasiswa mampu bekerja dalam tim dan berkomunikasi secara profesional dengan anggota tim maupun pihak terkait untuk menyelesaikan tugas teknik.', 1),
        (v_cpl_id, 'Mahasiswa mampu berperan aktif dalam tim dengan mengambil tanggung jawab yang jelas sesuai kompetensi masing-masing anggota.', 2),
        (v_cpl_id, 'Mahasiswa mampu berkontribusi dalam pengambilan keputusan tim secara kolaboratif dan demokratis.', 3),
        (v_cpl_id, 'Mahasiswa mampu bekerja sama dengan pihak luar (masyarakat, pemerintah, praktisi) yang memiliki latar belakang sosial dan budaya beragam dalam proyek teknik.', 4);

        -- CPL-09: Sikap (5 indikator)
        INSERT INTO cpl (id, prodi_id, kode_cpl, komponen, cpl, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            v_prodi_id,
            'CPL-09',
            'Sikap',
            'Mampu bertanggung jawab secara profesional dan mematuhi etika profesional terhadap masyarakat dalam merancang dan mengelola infrastruktur Teknik sumber daya air yang aman.',
            NOW(),
            NOW()
        ) RETURNING id INTO v_cpl_id;

        INSERT INTO cpl_indikator (cpl_id, indikator_kerja, urutan) VALUES
        (v_cpl_id, 'Mahasiswa mampu menunjukkan etika komunikasi profesional, termasuk kejelasan sumber data, pengakuan kontribusi pihak lain, dan penyampaian informasi secara objektif.', 1),
        (v_cpl_id, 'Mahasiswa mampu bekerja secara mandiri maupun dalam tim untuk menyelesaikan tugas sesuai batasan yang ada, sambil menjaga profesionalisme dan etika kerja.', 2),
        (v_cpl_id, 'Mahasiswa mampu mematuhi standar, regulasi, dan kode etik profesi seperti peraturan pemerintah, SNI, pedoman teknis, dan standar internasional yang relevan.', 3),
        (v_cpl_id, 'Mahasiswa mampu menghindari praktik tidak etis, seperti manipulasi data, plagiarisme, konflik kepentingan, atau penggunaan metode yang tidak aman.', 4),
        (v_cpl_id, 'Mahasiswa mampu mempertahankan integritas profesional saat menghadapi tekanan atau pengaruh eksternal dalam proses perancangan atau pengelolaan infrastruktur air.', 5);

        -- CPL-10: Sikap (4 indikator)
        INSERT INTO cpl (id, prodi_id, kode_cpl, komponen, cpl, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            v_prodi_id,
            'CPL-10',
            'Sikap',
            'Mampu menyadari pentingnya pembelajaran sepanjang hayat dengan menerapkan Al Islam Kemuhammadiyahan dan terus mengakses pengetahuan terbaru dan isu yang sejalan dengan perkembangan zaman di bidang sumber daya air.',
            NOW(),
            NOW()
        ) RETURNING id INTO v_cpl_id;

        INSERT INTO cpl_indikator (cpl_id, indikator_kerja, urutan) VALUES
        (v_cpl_id, 'Mahasiswa mampu menunjukkan sikap dan perilaku yang mencerminkan nilai-nilai Al Islam Kemuhammadiyahan (kejujuran, amanah, disiplin, tanggung jawab, dan etos kerja) dalam aktivitas akademik dan profesi.', 1),
        (v_cpl_id, 'Mahasiswa mampu mengikuti perkembangan isu-isu global dan nasional, seperti perubahan iklim, ketahanan air, teknologi digital, dan keberlanjutan.', 2),
        (v_cpl_id, 'Mahasiswa mampu menerapkan prinsip Al Islam Kemuhammadiyahan dalam pengambilan keputusan akademik dan profesional, termasuk menjunjung etika, kemaslahatan, dan tanggung jawab sosial.', 3),
        (v_cpl_id, 'Mahasiswa mampu mengintegrasikan nilai spiritual, moral, dan kemanusiaan dalam memandang tantangan teknis dan sosial di bidang sumber daya air.', 4);

        RAISE NOTICE '✓ Successfully imported 10 CPL with 41 indikator kinerja for S1-TI';
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

SELECT 'Total CPL: ' || COUNT(*) as info FROM cpl;
SELECT 'Total Indikator: ' || COUNT(*) as info FROM cpl_indikator;
