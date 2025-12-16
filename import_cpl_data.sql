-- Import Data CPL (Capaian Pembelajaran Lulusan)
-- Jalankan query ini setelah memilih prodi_id yang sesuai

-- Pertama, dapatkan prodi_id yang akan digunakan
-- SELECT id, nama_prodi FROM prodis WHERE deleted_at IS NULL;

-- Ganti 'YOUR_PRODI_ID_HERE' dengan UUID prodi yang sesuai
-- Contoh: '550e8400-e29b-41d4-a716-446655440000'

DO $$
DECLARE
    v_prodi_id UUID := '657c3ce6-b0f4-46d0-b143-f0b3be893208'; -- GANTI DENGAN PRODI_ID YANG SESUAI
BEGIN

-- CPL-01: Kompetensi Sikap
INSERT INTO cpl (id, prodi_id, kode_cpl, komponen, deskripsi, created_at, updated_at)
VALUES (gen_random_uuid(), v_prodi_id, 'CPL-01', 'Kompetensi Sikap', 
'Mampu menunjukkan perilaku profesional, etis dan mampu belajar sepanjang hayat untuk meningkatkan kompetensi diri', 
CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- CPL-02: Kompetensi Khusus
INSERT INTO cpl (id, prodi_id, kode_cpl, komponen, deskripsi, created_at, updated_at)
VALUES (gen_random_uuid(), v_prodi_id, 'CPL-02', 'Kompetensi Khusus', 
'Mampu menganalisis suatu sistem baik yang besar maupun kompleks dengan mengumpulkan data dan melakukan analisis untuk menghasilkan kesimpulan yang benar, terdokumentasi dengan baik, serta mampu bekerja baik secara individu maupun kelompok', 
CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- CPL-03: Kompetensi Khusus
INSERT INTO cpl (id, prodi_id, kode_cpl, komponen, deskripsi, created_at, updated_at)
VALUES (gen_random_uuid(), v_prodi_id, 'CPL-03', 'Kompetensi Khusus', 
'Mampu menguasai dan menerapkan perangkat komputasi untuk mengelola proyek berbasis TIK secara profesional di lingkungannya', 
CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- CPL-04: Kompetensi Khusus
INSERT INTO cpl (id, prodi_id, kode_cpl, komponen, deskripsi, created_at, updated_at)
VALUES (gen_random_uuid(), v_prodi_id, 'CPL-04', 'Kompetensi Khusus', 
'Mampu menganalisis, merancang, mengimplementasikan, dan menerapkan prinsip-prinsip di bidang pengetahuan Informatika', 
CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- CPL-05: Kompetensi Khusus
INSERT INTO cpl (id, prodi_id, kode_cpl, komponen, deskripsi, created_at, updated_at)
VALUES (gen_random_uuid(), v_prodi_id, 'CPL-05', 'Kompetensi Khusus', 
'Mampu menerapkan tools-tools/aplikasi dan teknik analisis modern dalam praktik teknik informatika', 
CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- CPL-06: Kompetensi Umum
INSERT INTO cpl (id, prodi_id, kode_cpl, komponen, deskripsi, created_at, updated_at)
VALUES (gen_random_uuid(), v_prodi_id, 'CPL-06', 'Kompetensi Umum', 
'Mampu berkomunikasi secara efektif baik lisan dan tertulis serta komunikasi visual dan grafis', 
CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- CPL-07: Kompetensi Umum
INSERT INTO cpl (id, prodi_id, kode_cpl, komponen, deskripsi, created_at, updated_at)
VALUES (gen_random_uuid(), v_prodi_id, 'CPL-07', 'Kompetensi Umum', 
'Mampu mengintegrasikan pengetahuan dan keterampilan baik teknis maupun sosial dalam bentuk kolaborasi yang sinergis', 
CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- CPL-08: Kompetensi Sikap
INSERT INTO cpl (id, prodi_id, kode_cpl, komponen, deskripsi, created_at, updated_at)
VALUES (gen_random_uuid(), v_prodi_id, 'CPL-08', 'Kompetensi Sikap', 
'Mampu bekerja dalam tim multidisiplin dan multikultural', 
CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- CPL-09: Sikap
INSERT INTO cpl (id, prodi_id, kode_cpl, komponen, deskripsi, created_at, updated_at)
VALUES (gen_random_uuid(), v_prodi_id, 'CPL-09', 'Sikap', 
'Mampu berkontribusi dalam perencanaan dan pengelolaan sumber daya organisasi dan mengevaluasi kinerja secara komprehensif dengan memanfaatkan IPTEK (Al Islam)', 
CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- CPL-10: Sikap
INSERT INTO cpl (id, prodi_id, kode_cpl, komponen, deskripsi, created_at, updated_at)
VALUES (gen_random_uuid(), v_prodi_id, 'CPL-10', 'Sikap', 
'Mampu menerapkan nilai-nilai Al-Islam dan Kemuhammadiyahan dalam kehidupan bermasyarakat', 
CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

RAISE NOTICE 'Berhasil mengimport 10 data CPL untuk prodi_id: %', v_prodi_id;

END $$;

-- Verifikasi data yang berhasil diimport
-- SELECT kode_cpl, komponen, deskripsi FROM cpl WHERE prodi_id = 'YOUR_PRODI_ID_HERE' ORDER BY kode_cpl;
