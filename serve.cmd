@echo off
rem ============================================================
rem  Dieta 16:8 — server locale di prova
rem  Doppio click su questo file: apre l'app nel browser.
rem  Lascia aperta questa finestra finche' usi l'app.
rem ============================================================
cd /d "%~dp0"
echo.
echo  Avvio l'app su http://localhost:8080  (chiudi questa finestra per fermare)
echo.
start "" "http://localhost:8080"
py -m http.server 8080 2>nul || python -m http.server 8080 2>nul || (
  echo ERRORE: Python non trovato. Installalo da python.org oppure usa la guida docs/deploy.md
  pause
)
