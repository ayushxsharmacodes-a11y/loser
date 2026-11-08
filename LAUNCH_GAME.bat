@echo off
title LOSER - AAA Cinematic Game Experience Launcher
color 0C
echo ===================================================================
echo           PRO_GAME STUDIOS PRESENTS: L O S E R
echo              AAA CINEMATIC INTERACTIVE TRAILER
echo ===================================================================
echo.
echo [1] Opening trailer in your default browser...
start http://localhost:5173/
echo.
echo [2] Starting local game server (Keep this window open)...
echo.
echo NOTE FOR PHONE: Make sure your phone is connected to the same Wi-Fi.
echo Open your phone's browser and go to your network IP shown below!
echo.
call npm.cmd run dev -- --host
pause
