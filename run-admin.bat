@echo off
title AtoI Infra - Admin Panel (Port 3000)
cd /d "%~dp0Admin-Panel"
echo =======================================================
echo Starting Admin Panel on http://localhost:3000...
echo =======================================================
npm run dev
pause
