@echo off
echo.
echo ========================================
echo   SuperNS Web Interface
echo   by L'Araignee 
echo ========================================
echo.
echo Installing dependencies...
py -m pip install -r requirements.txt --quiet
echo.
echo Starting server...
echo.
py app.py
pause
