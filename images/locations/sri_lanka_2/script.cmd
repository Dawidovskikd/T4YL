@echo off
break>paste.txt
for /F "tokens=*" %%A in (nazwy.txt) do @echo ^<div^>^<img data-lazy^="../images/locations/sri_lanka_2/%%A"^>^</div^> >> paste.txt 
