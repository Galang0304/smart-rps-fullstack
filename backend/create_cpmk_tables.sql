-- Create CPMK table
CREATE TABLE IF NOT EXISTS cpmk (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
	cpmk_number int NOT NULL,
	description text NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
	deleted_at timestamp
);

-- Create Sub-CPMK table
CREATE TABLE IF NOT EXISTS sub_cpmk (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	cpmk_id uuid NOT NULL REFERENCES cpmk(id) ON DELETE CASCADE,
	sub_cpmk_number int NOT NULL,
	description text NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
	deleted_at timestamp
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_cpmk_course_id ON cpmk(course_id);
CREATE INDEX IF NOT EXISTS idx_sub_cpmk_cpmk_id ON sub_cpmk(cpmk_id);

SELECT 'CPMK tables created successfully!' AS message;
