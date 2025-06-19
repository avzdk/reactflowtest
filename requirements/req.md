# Behovsbeskrivelse

## Generel beskrivelse

Vi har vores datamodeller vedligeholdt i et system som som kan eksportere til en json fil.  Det ønskede system skal kunne give os mulighed for at vedligeholde en række forskellige UML-diagrammer som tager udgangspunkt i udvalgte data i denne jsonfil.

## Forretningsbehov

### Opret diagram
1. Indlæse jsonfil. Se eksempel (example.json)
2. Oprette tomt diagram
3. Udvælge uml-klasse fra data og få vist den på diagram med attributter.
4. Tilføje yderligere uml-klasser og få vist disse samt relationer til andre klasser.

### Flytte rundt på elementer i diagram
1. Flytte klasser rundt så relationer fortsat bevares.

### Gem og åen igen
1. Gemme udseende af diagram med placering af elementer.
2. Åbne gemt diagram igen til redigering.
3. Genindlæse ændringer til klasser json-fil til viste klasser, f.esk. nye/slettede attributter, eller relationer. 

## Teknisk behov

Frontend: React Flow 
Data persistering : json.filer
Evt. Backend: Python 

https://reactflow.dev/api-reference

