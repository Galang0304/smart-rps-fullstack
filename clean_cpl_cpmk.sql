-- Clean all CPL and CPMK data
-- Run this before importing new data

-- Delete all Sub-CPMK first (foreign key constraint)
DELETE FROM sub_cpmk;

-- Delete all CPMK
DELETE FROM cpmk;

-- Delete all CPL
DELETE FROM cpl;

-- Reset sequences if needed
-- ALTER SEQUENCE cpl_id_seq RESTART WITH 1;
-- ALTER SEQUENCE cpmk_id_seq RESTART WITH 1;
-- ALTER SEQUENCE sub_cpmk_id_seq RESTART WITH 1;

SELECT 'All CPL and CPMK data cleaned successfully!' as status;
