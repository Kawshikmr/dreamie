@echo off
title Push Dreamie to GitHub
echo ===================================================
echo Pushing Dreamie source to https://github.com/Kawshikmr/dreamie...
echo ===================================================
cd /d F:\Apps\dreamie
git push -u origin main
echo.
echo ===================================================
echo Publishing live web build to GitHub Pages...
echo ===================================================
call npm run deploy
echo.
echo ===================================================
echo All Done!
echo In GitHub Settings ^> Pages, ensure Source is 'Deploy from a branch' and Branch is 'gh-pages'.
echo Your site is live at: https://kawshikmr.github.io/dreamie/
echo ===================================================
pause
