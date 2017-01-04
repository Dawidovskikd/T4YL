@echo off
break>paste.txt
for /F "tokens=*" %%A in (nazwy.txt) do @echo ^<div^>^<img data-lazy^="../images/locations/sri_lanka/%%A"^>^</div^> >> paste.txt 
