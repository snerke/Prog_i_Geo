# Prog_i_Geo

Kan være bedre:

- Kan ikke ha punkt, linjer og polygoner i samme lag
- Farge blir endret hvis man bytter stil på
- Nytt (selv-laget) punkt havner ikke øverst i lista over punkt

TODO:

- Resette valg av lag etter gjennomført operasjon
- Legge til funksjonalitet
  - Snitt
  -
- Mulighet for å legge til linje-lag
- Fikse setLayers/getLayers slik at lista med lag har riktig rekkefølge etter lag har blitt flyttet og det legges til nye lag
  - Se på å lage en array med layer-ids hvor man legger til layer-ids ettersom lag legges til i kartet, og som oppdateres når lag flyttes opp/ned
- Addpoint
- velge navn på lag når nye lag skal legges til
- (laste opp egne geojson-lag)
- Vurdere om switchLayer skal være med eller ikke pga problemer med:
  - Fungerer ikke med endret rekkefølge på lag
  - Gir nye, tilfeldige farger
