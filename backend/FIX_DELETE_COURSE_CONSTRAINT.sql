-- RUN THIS IN pgAdmin Query Tool
-- This will fix the foreign key constraint issue

-- Step 1: Drop the old constraint
ALTER TABLE generated_rps 
DROP CONSTRAINT IF EXISTS generated_rps_course_id_fkey CASCADE;

-- Step 2: Add new constraint with CASCADE delete
ALTER TABLE generated_rps 
ADD CONSTRAINT generated_rps_course_id_fkey 
FOREIGN KEY (course_id) 
REFERENCES courses(id) 
ON DELETE CASCADE;

-- Verify the change
SELECT 
    'Fixed!' as status,
    constraint_name,
    delete_rule
FROM information_schema.referential_constraints 
WHERE constraint_name = 'generated_rps_course_id_fkey';
