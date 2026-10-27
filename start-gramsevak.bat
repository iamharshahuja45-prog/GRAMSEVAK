@echo off
set "PATH=%~dp0.tools\node;%PATH%"
echo Starting Gramsevak on http://localhost:3000 ...
"%~dp0.tools\node\node.exe" "%~dp0node_modules\vite\bin\vite.js" --host 0.0.0.0 --port 3000
pause
