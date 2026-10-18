# Data Model

## Casella

Una casella rappresenta un punto del percorso del Gioco dell'LoCa.

Ogni casella è definita da:

### ID
Numero progressivo univoco della casella.

### Posizione
Coordinate relative rispetto al tabellone.

### Contenuto
Informazioni mostrate quando una pedina arriva sulla casella.

Può contenere:

- Testo
- Immagine
- Audio
- Video

### AZIONE
Definisce cosa accade quando una pedina raggiunge la casella.

### Stato

Indica se la casella è:

- configurata
- non configurata
- disabilitata

### Tipo

Identifica il comportamento della casella.

Esempi:

- normale
- partenza
- arrivo
- bonus
- malus
- domanda
- vai a...
- salta turno

## Principi
Una casella deve contenere tutte le informazioni necessarie al gioco.
Nessuna informazione relativa ad una casella deve essere codificata nel software.