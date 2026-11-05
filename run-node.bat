@echo off
title AtoI Infra - Backend Service
cd /d "%~dp0Backend"
echo =======================================================
echo Starting AtoI Infra Backend Service (Django REST Framework)
echo API Base: http://localhost:5000/api/v1
echo =======================================================
python manage.py runserver 5000
pause
