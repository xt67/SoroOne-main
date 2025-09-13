@echo off
echo.
echo 🎯 SoroOne Daily Maintenance
echo =============================
echo.

set current_date=%date:~-4,4%-%date:~-7,2%-%date:~-10,2%
echo 📅 Date: %DATE%
echo.

echo 🔧 Running automated maintenance tasks...
echo.

node scripts/daily-maintenance.js

if %errorlevel% equ 0 (
    echo.
    echo ✅ Daily maintenance completed successfully!
    echo 🚀 Your GitHub contribution for %current_date% has been added!
    echo.
    echo 📊 Contribution Streak Tips:
    echo • Run this script daily to maintain your streak
    echo • The script automatically updates badges and docs  
    echo • Each commit is unique with timestamp-based changes
    echo • Check GitHub to see your updated contribution graph!
) else (
    echo.
    echo ⚠️ Maintenance completed with some issues
    echo.
    echo 💡 Manual fallback:
    echo git add .
    echo git commit -m "docs: Daily maintenance - update badges and formatting"
    echo git push origin main
)

echo.
pause