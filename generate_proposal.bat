@echo off
echo ===================================================
echo   NaviGo Tech Solutions - Proposal PDF Generator
echo ===================================================

if "%~1"=="" (
    echo.
    echo Please provide a config JSON file!
    echo.
    echo Example:
    echo   generate_proposal.bat "D:\NaviGo Multi-Agent System\output\proposals\templates\starter_template.json"
    echo.
    echo Or simply drag-and-drop any JSON file onto this .bat file.
    echo.
    pause
    exit /b
)

echo Generating Proposal PDF for: %~1
node "D:\NaviGo Multi-Agent System\scripts\generate_navigo_proposal.mjs" "%~1"

echo.
echo Done! Check D:\NaviGo Multi-Agent System\output\proposals\
pause
