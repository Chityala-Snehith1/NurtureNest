-- NurtureNest Oracle Database Verification Script
-- Run this script in Oracle SQL*Plus to verify the database schema

-- Connect to your Oracle database first:
-- SQL> CONNECT your_username/your_password@localhost:1521/XE
-- or
-- SQL> CONNECT your_username/your_password@XE

PROMPT ============================================================================
PROMPT NurtureNest Oracle Database Verification
PROMPT ============================================================================

PROMPT 
PROMPT 1. Checking if all tables exist...
PROMPT ============================================================================
SELECT table_name FROM user_tables ORDER BY table_name;

PROMPT 
PROMPT 2. Checking table structures...
PROMPT ============================================================================
PROMPT Users table structure:
DESCRIBE users;

PROMPT 
PROMPT Appointments table structure:
DESCRIBE appointments;

PROMPT 
PROMPT Articles table structure:
DESCRIBE articles;

PROMPT 
PROMPT Forum_posts table structure:
DESCRIBE forum_posts;

PROMPT 
PROMPT 3. Checking row counts in all tables...
PROMPT ============================================================================
SELECT 'users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'appointments', COUNT(*) FROM appointments
UNION ALL
SELECT 'consultations', COUNT(*) FROM consultations
UNION ALL
SELECT 'articles', COUNT(*) FROM articles
UNION ALL
SELECT 'forum_posts', COUNT(*) FROM forum_posts
UNION ALL
SELECT 'forum_comments', COUNT(*) FROM forum_comments
UNION ALL
SELECT 'emergency_contacts', COUNT(*) FROM emergency_contacts
UNION ALL
SELECT 'health_records', COUNT(*) FROM health_records;

PROMPT 
PROMPT 4. Checking sample data in articles table...
PROMPT ============================================================================
SELECT title, category, author FROM articles;

PROMPT 
PROMPT 5. Checking indexes...
PROMPT ============================================================================
SELECT index_name, table_name, column_name 
FROM user_ind_columns 
WHERE table_name IN ('USERS', 'APPOINTMENTS', 'CONSULTATIONS', 'ARTICLES', 
                     'FORUM_POSTS', 'FORUM_COMMENTS', 'EMERGENCY_CONTACTS', 'HEALTH_RECORDS')
ORDER BY table_name, index_name;

PROMPT 
PROMPT 6. Checking foreign key constraints...
PROMPT ============================================================================
SELECT constraint_name, table_name, r_constraint_name, delete_rule
FROM user_constraints 
WHERE constraint_type = 'R'
AND table_name IN ('APPOINTMENTS', 'CONSULTATIONS', 'FORUM_POSTS', 
                   'FORUM_COMMENTS', 'EMERGENCY_CONTACTS', 'HEALTH_RECORDS');

PROMPT 
PROMPT 7. Checking sequences (for identity columns)...
PROMPT ============================================================================
SELECT sequence_name FROM user_sequences WHERE sequence_name LIKE 'ISEQ$$%';

PROMPT 
PROMPT 8. Testing a simple insert and select (optional)...
PROMPT ============================================================================
-- Uncomment the following lines to test insert/select operations:
-- INSERT INTO users (email, password_hash, first_name, last_name) 
-- VALUES ('test@example.com', 'dummy_hash', 'Test', 'User');
-- SELECT id, email, first_name, last_name FROM users WHERE email = 'test@example.com';
-- DELETE FROM users WHERE email = 'test@example.com';

PROMPT 
PROMPT ============================================================================
PROMPT Verification complete!
PROMPT ============================================================================
