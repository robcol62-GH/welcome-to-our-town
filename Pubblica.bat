
@echo off
cd /d "c:\Sviluppo\Progetti\WelcomeToOurTown"

if errorlevel 1 (
    echo ERRORE: cartella del progetto non trovata.
    pause
    exit /b 1
)

echo.
echo ========================================
echo        PUBBLICAZIONE WTOT
echo ========================================
echo.

echo [1/3] Aggiungo le modifiche...
git add .
if errorlevel 1 goto errore

echo.
echo [2/3] Verifico le modifiche...
git diff --cached --quiet
if not errorlevel 1 (
    echo Nessuna modifica da registrare.
    goto pubblica
)

echo.
echo Creo il commit...
git commit -m "Aggiornamento WTOT"
if errorlevel 1 goto errore

:pubblica
echo.
echo [3/3] Invio a GitHub...
git push origin main
if errorlevel 1 goto errore

echo.
echo ========================================
echo        PUBBLICAZIONE COMPLETATA
echo ========================================
echo.
pause
exit /b 0

:errore
echo.
echo ========================================
echo   ERRORE DURANTE LA PUBBLICAZIONE!
echo ========================================
echo.
echo Controlla il messaggio Git mostrato sopra.
echo.
pause
exit /b 1
