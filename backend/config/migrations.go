package config

import (
	"log"

	"gorm.io/gorm"
)

// RunMigrations handles all database table creation
func RunMigrations(db *gorm.DB) error {
	log.Println("Starting database migrations...")

	// Create UUID extension
	if err := db.Exec("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"").Error; err != nil {
		log.Printf("Warning: Could not create UUID extension: %v", err)
	}

	// FIX: Drop and recreate foreign key constraint for generated_rps
	log.Println("Fixing foreign key constraints...")
	db.Exec("ALTER TABLE generated_rps DROP CONSTRAINT IF EXISTS generated_rps_course_id_fkey CASCADE")
	db.Exec("ALTER TABLE generated_rps ADD CONSTRAINT generated_rps_course_id_fkey FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE")
	log.Println("✓ Foreign key constraints fixed")

	// Create all tables
	tables := []string{
		`CREATE TABLE IF NOT EXISTS users (
			id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
			username text NOT NULL UNIQUE,
			password text NOT NULL,
			email text,
			display_name text,
			role text NOT NULL DEFAULT 'viewer',
			created_at timestamp DEFAULT CURRENT_TIMESTAMP,
			updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
			deleted_at timestamp
		)`,

		`CREATE TABLE IF NOT EXISTS prodis (
			id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
			user_id uuid REFERENCES users(id),
			program_id uuid,
			kode_prodi text NOT NULL,
			nama_prodi text NOT NULL,
			fakultas text NOT NULL,
			jenjang text NOT NULL,
			email_kaprodi text NOT NULL,
			nama_kaprodi text NOT NULL,
			is_active boolean DEFAULT true,
			created_at timestamp DEFAULT CURRENT_TIMESTAMP,
			updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
			deleted_at timestamp
		)`,

		`CREATE TABLE IF NOT EXISTS programs (
			id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
			prodi_id uuid REFERENCES prodis(id),
			code text NOT NULL UNIQUE,
			name text NOT NULL,
			created_at timestamp DEFAULT CURRENT_TIMESTAMP,
			updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
			deleted_at timestamp
		)`,

		`CREATE TABLE IF NOT EXISTS dosens (
			id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
			user_id uuid REFERENCES users(id),
			prodi_id uuid REFERENCES prodis(id),
			nidn text NOT NULL UNIQUE,
			nama_lengkap text NOT NULL,
			email text NOT NULL UNIQUE,
			no_telepon text,
			jabatan_fungsional text,
			is_active boolean DEFAULT true,
			created_at timestamp DEFAULT CURRENT_TIMESTAMP,
			updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
			deleted_at timestamp
		)`,

		`CREATE TABLE IF NOT EXISTS courses (
			id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
			program_id uuid REFERENCES programs(id),
			code text NOT NULL,
			title text NOT NULL,
			credits int,
			semester int,
			tahun text NOT NULL DEFAULT '2025',
			created_at timestamp DEFAULT CURRENT_TIMESTAMP,
			updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
			deleted_at timestamp
		)`,

		`CREATE TABLE IF NOT EXISTS templates (
			id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
			program_id uuid REFERENCES programs(id),
			name text NOT NULL,
			description text,
			created_by uuid REFERENCES users(id),
			is_active boolean DEFAULT true,
			created_at timestamp DEFAULT CURRENT_TIMESTAMP,
			updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
			deleted_at timestamp
		)`,

		`CREATE TABLE IF NOT EXISTS template_versions (
			id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
			template_id uuid REFERENCES templates(id),
			version int NOT NULL,
			definition jsonb,
			created_by uuid REFERENCES users(id),
			created_at timestamp DEFAULT CURRENT_TIMESTAMP,
			updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
			deleted_at timestamp
		)`,

		`CREATE TABLE IF NOT EXISTS generated_rps (
			id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
			template_version_id uuid REFERENCES template_versions(id) ON DELETE SET NULL,
			course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
			generated_by uuid REFERENCES users(id),
			status text DEFAULT 'draft',
			result jsonb,
			exported_file_url text,
			ai_metadata jsonb,
			created_at timestamp DEFAULT CURRENT_TIMESTAMP,
			updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
			deleted_at timestamp
		)`,

		`CREATE TABLE IF NOT EXISTS dosen_rps_access (
			id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
			dosen_id uuid NOT NULL REFERENCES dosens(id),
			generated_rps_id uuid NOT NULL REFERENCES generated_rps(id),
			access_level text NOT NULL DEFAULT 'read',
			granted_by uuid REFERENCES users(id),
			created_at timestamp DEFAULT CURRENT_TIMESTAMP,
			updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
			deleted_at timestamp
		)`,

		`CREATE TABLE IF NOT EXISTS cpl (
			id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
			prodi_id uuid NOT NULL REFERENCES prodis(id),
			kode_cpl text NOT NULL,
			komponen text NOT NULL,
		cpl text NOT NULL,
		created_at timestamp DEFAULT CURRENT_TIMESTAMP,
		updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
		deleted_at timestamp
	)`,

		`CREATE TABLE IF NOT EXISTS cpl_indikator (
		id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
		cpl_id uuid NOT NULL REFERENCES cpl(id) ON DELETE CASCADE,
		indikator_kerja text NOT NULL,
		urutan int NOT NULL,
		created_at timestamp DEFAULT CURRENT_TIMESTAMP,
		updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
		deleted_at timestamp
	)`,

		`CREATE TABLE IF NOT EXISTS cpmk (
		id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
		course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
		cpmk_number int NOT NULL,
		description text NOT NULL,
		created_at timestamp DEFAULT CURRENT_TIMESTAMP,
		updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
		deleted_at timestamp
	)`,

		`CREATE TABLE IF NOT EXISTS sub_cpmk (
		id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
		cpmk_id uuid NOT NULL REFERENCES cpmk(id) ON DELETE CASCADE,
		sub_cpmk_number int NOT NULL,
		description text NOT NULL,
		created_at timestamp DEFAULT CURRENT_TIMESTAMP,
		updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
		deleted_at timestamp
	)`,
	}

	for i, sql := range tables {
		log.Printf("Creating table %d...", i+1)
		if err := db.Exec(sql).Error; err != nil {
			log.Printf("Warning: Failed to create table %d: %v", i+1, err)
		} else {
			log.Printf("✓ Table %d created successfully", i+1)
		}
	}

	// Create indexes for common queries
	indexes := []string{
		"CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)",
		"CREATE INDEX IF NOT EXISTS idx_prodis_kode_prodi ON prodis(kode_prodi)",
		"CREATE INDEX IF NOT EXISTS idx_programs_code ON programs(code)",
		"CREATE INDEX IF NOT EXISTS idx_dosens_nidn ON dosens(nidn)",
		"CREATE INDEX IF NOT EXISTS idx_courses_program_id ON courses(program_id)",
		"CREATE INDEX IF NOT EXISTS idx_templates_program_id ON templates(program_id)",
		"CREATE INDEX IF NOT EXISTS idx_generated_rps_course_id ON generated_rps(course_id)",
		"CREATE INDEX IF NOT EXISTS idx_generated_rps_dosen_id ON generated_rps(dosen_id)",
		"CREATE INDEX IF NOT EXISTS idx_dosen_rps_access_dosen_id ON dosen_rps_access(dosen_id)",
		"CREATE INDEX IF NOT EXISTS idx_cpl_prodi_id ON cpl(prodi_id)",
		"CREATE INDEX IF NOT EXISTS idx_cpl_kode_cpl ON cpl(kode_cpl)",
		"CREATE INDEX IF NOT EXISTS idx_cpl_indikator_cpl_id ON cpl_indikator(cpl_id)",
		"CREATE INDEX IF NOT EXISTS idx_cpmk_course_id ON cpmk(course_id)",
		"CREATE INDEX IF NOT EXISTS idx_sub_cpmk_cpmk_id ON sub_cpmk(cpmk_id)",
	}

	for _, sql := range indexes {
		if err := db.Exec(sql).Error; err != nil {
			log.Printf("Warning: Failed to create index: %v", err)
		}
	}

	// Create foreign key for prodis.program_id (after programs table exists)
	db.Exec(`ALTER TABLE prodis ADD CONSTRAINT fk_prodis_programs 
		FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE SET NULL`)

	// Add bobot columns if they don't exist
	log.Println("Adding bobot columns...")
	db.Exec(`ALTER TABLE cpmk ADD COLUMN IF NOT EXISTS bobot DECIMAL(5,2) DEFAULT 0`)
	db.Exec(`ALTER TABLE sub_cpmk ADD COLUMN IF NOT EXISTS bobot DECIMAL(5,2) DEFAULT 0`)
	log.Println("✓ Bobot columns added")

	// Add matched_cpl column to cpmk table
	log.Println("Adding matched_cpl column...")
	db.Exec(`ALTER TABLE cpmk ADD COLUMN IF NOT EXISTS matched_cpl TEXT`)
	log.Println("✓ matched_cpl column added")

	// Add is_common column to courses table for common courses feature
	log.Println("Adding is_common column to courses...")
	db.Exec(`ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_common BOOLEAN DEFAULT false`)
	log.Println("✓ is_common column added")

	// Create course_prodi_assigns table for assigning common courses to prodis
	log.Println("Creating course_prodi_assigns table...")
	db.Exec(`CREATE TABLE IF NOT EXISTS course_prodi_assigns (
		id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
		course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
		prodi_id uuid NOT NULL REFERENCES prodis(id) ON DELETE CASCADE,
		created_at timestamp DEFAULT CURRENT_TIMESTAMP,
		deleted_at timestamp,
		UNIQUE(course_id, prodi_id)
	)`)
	db.Exec(`CREATE INDEX IF NOT EXISTS idx_course_prodi_assigns_course_id ON course_prodi_assigns(course_id)`)
	db.Exec(`CREATE INDEX IF NOT EXISTS idx_course_prodi_assigns_prodi_id ON course_prodi_assigns(prodi_id)`)
	log.Println("✓ course_prodi_assigns table created")

	log.Println("✓ Database migrations completed")
	return nil
}
