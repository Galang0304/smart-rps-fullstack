-- Fix foreign key constraints for generated_rps table
-- This allows courses to be deleted even if they have generated RPS

-- Drop existing foreign key constraint
ALTER TABLE generated_rps 
DROP CONSTRAINT IF EXISTS fk_generated_rps_course;

-- Add new constraint with ON DELETE CASCADE
ALTER TABLE generated_rps 
ADD CONSTRAINT fk_generated_rps_course 
FOREIGN KEY (course_id) 
REFERENCES courses(id) 
ON DELETE CASCADE;

-- Also fix template_version_id constraint (set to NULL when template is deleted)
ALTER TABLE generated_rps 
DROP CONSTRAINT IF EXISTS generated_rps_template_version_id_fkey;

ALTER TABLE generated_rps 
ADD CONSTRAINT generated_rps_template_version_id_fkey 
FOREIGN KEY (template_version_id) 
REFERENCES template_versions(id) 
ON DELETE SET NULL;

-- Verify constraints
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints AS rc
    ON rc.constraint_name = tc.constraint_name
WHERE tc.table_name = 'generated_rps' 
AND tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.constraint_name;
