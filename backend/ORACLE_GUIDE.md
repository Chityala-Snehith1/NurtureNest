# Oracle SQL*Plus Commands Guide for NurtureNest

## Connecting to Oracle Database

### 1. Start SQL*Plus
```bash
sqlplus
```

### 2. Connect to Database
```sql
-- Connect as system user (if you have admin rights)
SQL> CONNECT system/password@localhost:1521/XE

-- Connect as your database user
SQL> CONNECT your_username/your_password@localhost:1521/XE

-- For local Oracle XE installation
SQL> CONNECT your_username/your_password@XE
```

## Running the Schema Creation

### 1. Navigate to the Backend Directory
```bash
cd d:\miniproject\backend
```

### 2. Run the Schema Script
```sql
SQL> @schema.sql
```
or
```sql
SQL> START schema.sql
```

## Verifying Tables Are Created

### 1. Quick Table Check
```sql
-- List all tables in your schema
SQL> SELECT table_name FROM user_tables ORDER BY table_name;
```

### 2. Check Specific Table Structure
```sql
-- Check users table structure
SQL> DESCRIBE users;
SQL> DESC users;

-- Check appointments table
SQL> DESCRIBE appointments;
```

### 3. Check Table Data
```sql
-- Check if sample articles were inserted
SQL> SELECT COUNT(*) FROM articles;
SQL> SELECT title, category FROM articles;
```

### 4. Run Complete Verification
```sql
SQL> @verify-schema.sql
```

## Common SQL*Plus Commands

### Basic Commands
```sql
-- Show current user
SQL> SHOW USER;

-- Show current database
SQL> SELECT name FROM v$database;

-- Show all your tables
SQL> SELECT table_name FROM user_tables;

-- Show table structure
SQL> DESCRIBE table_name;

-- Count rows in a table
SQL> SELECT COUNT(*) FROM table_name;
```

### Troubleshooting Commands
```sql
-- Check if table exists
SQL> SELECT COUNT(*) FROM user_tables WHERE table_name = 'USERS';

-- Check table privileges
SQL> SELECT * FROM user_tab_privs WHERE table_name = 'USERS';

-- Check for errors during table creation
SQL> SELECT * FROM user_errors;

-- Show last SQL statement
SQL> LIST;
```

## Expected Output After Schema Creation

### 1. Tables Created
You should see these tables:
- USERS
- APPOINTMENTS
- CONSULTATIONS
- ARTICLES
- FORUM_POSTS
- FORUM_COMMENTS
- EMERGENCY_CONTACTS
- HEALTH_RECORDS

### 2. Sample Data
The articles table should contain 4 sample records.

### 3. Indexes Created
Multiple indexes should be created for performance optimization.

## Testing the Database Connection

### 1. Test Insert Operation
```sql
-- Insert a test user
SQL> INSERT INTO users (email, password_hash, first_name, last_name) 
     VALUES ('test@example.com', 'dummy_hash', 'Test', 'User');

-- Check if inserted
SQL> SELECT * FROM users WHERE email = 'test@example.com';

-- Clean up
SQL> DELETE FROM users WHERE email = 'test@example.com';
SQL> COMMIT;
```

### 2. Test the Express Backend
After confirming tables are created, test the backend:

```bash
# In your project directory
npm run server
```

Then in another terminal:
```bash
npm run check-oracle
```

## Common Issues and Solutions

### 1. "Table or view does not exist"
- Check if you're connected to the right database
- Verify table name spelling (Oracle is case-sensitive for object names)
- Check if the schema script ran successfully

### 2. "Insufficient privileges"
- Connect as a user with CREATE TABLE privileges
- Grant necessary privileges to your user

### 3. "Oracle not responding"
- Check if Oracle service is running
- Verify connection string (host, port, SID)
- Check Oracle listener status

### 4. Check Oracle Services (Windows)
```bash
# Check Oracle services
net start | findstr Oracle

# Start Oracle service if needed
net start OracleServiceXE
net start OracleXETNSListener
```

## Useful SQL*Plus Settings

```sql
-- Set page size for better output
SQL> SET PAGESIZE 100;

-- Set line size
SQL> SET LINESIZE 120;

-- Show timing for queries
SQL> SET TIMING ON;

-- Show column headers
SQL> SET HEADING ON;

-- Format column output
SQL> COLUMN table_name FORMAT A20;
SQL> COLUMN column_name FORMAT A30;
```

This guide should help you verify that your Oracle database schema is properly created and ready for use with the NurtureNest application.
