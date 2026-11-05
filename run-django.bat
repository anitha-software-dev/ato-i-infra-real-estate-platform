@echo off
title AtoI Infra - Django REST Framework Backend (Port 5000)
cd /d "%~dp0Backend"
echo =======================================================
echo Starting Django REST Framework Backend on Port 5000...
echo API Base: http://localhost:5000/api/v1
echo =======================================================
python manage.py runserver 5000
pause
