@echo off
title AtoI Infra - Backend API (Port 8000)
cd /d "%~dp0Backend"
echo =======================================================
echo Starting Django REST Framework Backend on Port 8000...
echo API Base: http://localhost:8000/api/v1
echo =======================================================
python manage.py runserver 8000
pause
