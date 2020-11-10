start /min cmd /c "start-db.bat"
timeout /t 1
start /min cmd /c "start-server.bat"
timeout /t 1
start /min cmd /c "start-client.bat"
timeout /t 1
start /min cmd /c "start-imgs-server.bat"
timeout /t 1
start /min cmd /c "start-audios-server.bat"
timeout /t 1
start /min cmd /c "start-mv-audio.bat"
timeout /t 1
