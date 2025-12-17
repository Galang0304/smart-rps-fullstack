-- Script untuk membuat ulang tabel CPL dengan struktur baru
-- Menghapus tabel lama dan membuat tabel baru dengan kolom 'cpl' dan tabel 'cpl_indikator'

-- Drop existing tables
DROP TABLE IF EXISTS cpl_indikator CASCADE;
DROP TABLE IF EXISTS cpl CASCADE;

-- Create CPL table with new structure
CREATE TABLE IF NOT EXISTS cpl (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    prodi_id uuid NOT NULL REFERENCES prodis(id),
    kode_cpl text NOT NULL,
    komponen text NOT NULL,
    cpl text NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);

-- Create CPL Indikator table
CREATE TABLE IF NOT EXISTS cpl_indikator (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    cpl_id uuid NOT NULL REFERENCES cpl(id) ON DELETE CASCADE,
    indikator_kerja text NOT NULL,
    urutan int NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_cpl_prodi_id ON cpl(prodi_id);
CREATE INDEX IF NOT EXISTS idx_cpl_kode_cpl ON cpl(kode_cpl);
CREATE INDEX IF NOT EXISTS idx_cpl_indikator_cpl_id ON cpl_indikator(cpl_id);

SELECT 'Tables recreated successfully!' as status;
