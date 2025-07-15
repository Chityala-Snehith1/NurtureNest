-- Quick Start Script for Oracle Database
-- Replace 'your_username' and 'your_password' with your actual Oracle credentials

-- Connect to Oracle Database
-- CONNECT your_username/your_password@XE

-- Show current user to verify connection
SHOW USER;

-- Check Oracle version
SELECT banner FROM v$version WHERE banner LIKE 'Oracle%';

-- Create the NurtureNest schema
@@schema.sql

-- Verify the schema was created successfully
@@verify-schema.sql

-- Test basic operations
PROMPT Testing basic operations...
SELECT 'Connection successful! Ready to use NurtureNest with Oracle.' as STATUS FROM DUAL;

-- Optional: Enable Oracle to work with Node.js (if needed)
-- ALTER SESSION SET TIME_ZONE = 'UTC';

PROMPT 
PROMPT ===================================================
PROMPT Setup complete! You can now:
PROMPT 1. Run: npm run server (to start the backend)
PROMPT 2. Run: npm run dev (to start the frontend)
PROMPT 3. Run: npm run check-oracle (to verify setup)
PROMPT ===================================================
