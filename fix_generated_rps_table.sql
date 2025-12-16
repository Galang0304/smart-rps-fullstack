-- Fix generated_rps table structure
-- Jalankan ini untuk memperbaiki tabel generated_rps yang sudah ada

-- Tambah kolom yang tidak ada
ALTER TABLE generated_rps ADD COLUMN IF NOT EXISTS template_version_id uuid REFERENCES template_versions(id);
ALTER TABLE generated_rps ADD COLUMN IF NOT EXISTS generated_by uuid REFERENCES users(id);
ALTER TABLE generated_rps ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft';
ALTER TABLE generated_rps ADD COLUMN IF NOT EXISTS result jsonb;
ALTER TABLE generated_rps ADD COLUMN IF NOT EXISTS exported_file_url text;
ALTER TABLE generated_rps ADD COLUMN IF NOT EXISTS ai_metadata jsonb;

-- Migrasi data dari kolom lama jika ada (opsional)
-- UPDATE generated_rps SET result = content WHERE result IS NULL AND content IS NOT NULL;

-- Verifikasi struktur tabel
\d generated_rps;
