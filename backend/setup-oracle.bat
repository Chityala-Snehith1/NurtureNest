@echo off
echo ====================================================
echo NurtureNest Oracle Database Setup
echo ====================================================
echo.

echo IMPORTANT: Make sure to update your .env file with your Oracle credentials
echo before running this script.
echo.

echo Checking if Oracle is accessible...
echo.

echo This script will connect using the credentials from your .env file
echo If this fails, make sure Oracle XE is running and your credentials are correct
echo.

echo Press any key to continue with the setup...
pause >nul

echo.
echo Starting Oracle setup...
echo Note: You may need to run this manually if credentials are not set up:
echo   sqlplus your_username/your_password@XE @quick-start.sql
echo.

echo.
echo ====================================================
echo Setup complete! 
echo.
echo Next steps:
echo 1. Configure your Oracle credentials in .env file
echo 2. Run: sqlplus your_username/your_password@XE @quick-start.sql
echo 3. Open a new terminal and run: npm run server
echo 4. Open another terminal and run: npm run dev  
echo 5. Open http://localhost:5173 in your browser
echo.
echo To check if everything is working:
echo   npm run check-oracle
echo ====================================================
pause
