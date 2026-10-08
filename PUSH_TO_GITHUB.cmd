@echo off
title Push Dreamie to GitHub
echo ===================================================
echo Pushing Dreamie code to https://github.com/Kawshikmr/dreamie...
echo ===================================================
cd /d F:\Apps\dreamie
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo SUCCESS! Code pushed to GitHub.
    echo GitHub Actions will now build and publish your site at:
    echo https://kawshikmr.github.io/dreamie/
) else (
    echo An error occurred during push. Please check your GitHub login.
)
echo.
pause
