-- Clean up soft deleted courses (permanent delete)
-- Run this to remove courses that were soft deleted but still in database

DELETE FROM courses WHERE deleted_at IS NOT NULL;

-- Also clean up related CPMK and Sub-CPMK data for those deleted courses
-- (They should cascade delete automatically if foreign keys are set up correctly)

SELECT COUNT(*) as "Remaining Courses" FROM courses WHERE deleted_at IS NULL;

-- Show summary
SELECT 
    'Cleanup completed' as status,
    COUNT(*) as active_courses
FROM courses 
WHERE deleted_at IS NULL;
