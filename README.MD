API to analyze AQ of a region in Madrid

Datasets (BigQuery):

- cartodb-gcp-backend-data-team.code_test.airquality_stations => AQ station info + location
- cartodb-gcp-backend-data-team.code_test.airquality_measurements => AQ Pollutants of each station:
  timeinstant: time of the observation.
  station_id: station identifier.
  so2: μg/m3 de SO2 (sulfur dioxide). Threshold 180 μg/m3.
  no2: μg/m3 de NO2 (nitrogen dioxide). Threshold 200 μg/m3.
  co: mg/m3 de CO (carbon monoxide). Threshold 3 mg/m3.
  o3: μg/m3 de O3 (ozone). Threshold 200 μg/m3.
  pm10: μg/m3 de PM10 (particles smaller than 10 μm) Threshold 50 μg/m3.
  pm2_5 : μg/m3 de PM2,5 (particles smaller than 2,5 μm) Threshold 40 μg/m3.

Assignment: Create a public API (nodejs, typescript) with the following endpoints:

- Statistical measurement for stations
  PARAMETERS:
  Time range to filter by (date_from, date_to) (datetime, send as a where clause)
  Pollutant (so2, no2...) (TYPE, send as a where clause)
  Statistical measurement (avg, max, min...) (TYPE, query as SQL agregation field)
  OUTPUT:
  Array of stations with the following data: [{
  station_id,
  pollutant_aggregate,
  population (n of people that live inside the grid the station is placed in) (number, perform spatial join with wp_population_8d42d536)
  }]
- Time-series
  PARAMETERS:
  Time range to filter by (date_from, date_to) (datetimes, send as a where clause)
  Pollutant (so2, no2...) (TYPE, send as a where clause)
  Statistical measurement (avg, max, min...) (TYPE, query as SQL agregation field)
  Step (1 week, 1 day, 1 hour) (TYPE, send as group by)
  OUTPUT:
  Array of stations with the following data: [{
  station_id: TYPE(time/value)[]
  }]
  Include tests inside code.
  Develop a simple frontend with Builder: https://pinea.app.carto.com/maps
