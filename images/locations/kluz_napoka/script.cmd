@echo off
break>paste.txt
for /F "tokens=*" %%A in (nazwy.txt) do @echo ^<div^>^<img data-lazy^="../images/locations/kluz_napoka/%%A"^>^</div^> >> paste.txt 
