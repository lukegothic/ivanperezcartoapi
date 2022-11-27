INSTALLATION

run the command: npm install
create new application at https://pinea.app.carto.com/developers
after creating the application, create .env file at the folder root with the following contents:
CARTO_CLIENT_ID = "<your_cartoapp_client_id>"
CARTO_CLIENT_SECRET = "<your_cartoapp_client_secret>"

run the api with the command: npm start (api will start on port 3003)
launch api tests with the command: npm test

REQUIREMENTS

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
  Sample query:
  SELECT s.station_id, avg(aq.co) AS pollutant_aggregated, p.population FROM cartodb-gcp-backend-data-team.code_test.airquality_stations s LEFT JOIN cartodb-gcp-backend-data-team.code_test.airquality_measurements aq ON s.station_id = aq.station_id, carto-data.ac_1uzlc7pq.sub_worldpop_geography_esp_grid100m_v1 g LEFT JOIN carto-data.ac_1uzlc7pq.sub_worldpop_demographics_population_esp_grid100m_v1_yearly_2010 p ON g.geoid = p.geoid WHERE timeinstant BETWEEN "2015-12-11T00:30:00.000Z" AND "2016-12-20T11:30:00.000Z" AND ST_CONTAINS(g.geom, s.geom) GROUP BY s.station_id, p.population

- Time-series
  PARAMETERS:
  Time range to filter by (date_from, date_to) (datetimes, send as a where clause)
  Pollutant (so2, no2...) (TYPE, send as a where clause)
  Statistical measurement (avg, max, min...) (TYPE, query as SQL agregation field)
  Step (1 week, 1 day, 1 hour) (TYPE, send as group by)
  OUTPUT:
  Array of stations with the following data: [{
  station_id,
  measurements: Array of (time/value)
  }]

  Sample query:
  SELECT s.station_id, avg(aq.co) AS pollutant_aggregated, EXTRACT(year FROM CAST (aq.timeinstant AS TIMESTAMP)) AS year, EXTRACT(week FROM CAST (aq.timeinstant AS TIMESTAMP)) AS week FROM cartodb-gcp-backend-data-team.code_test.airquality_stations s LEFT JOIN cartodb-gcp-backend-data-team.code_test.airquality_measurements aq ON s.station_id = aq.station_id WHERE timeinstant BETWEEN "2016-11-14T01:00:00.000Z" AND "2016-11-30T22:30:00.000Z" GROUP BY s.station_id, year, week ORDER BY s.station_id, year, week

  Include tests inside code.
  Develop a simple frontend with Builder: https://pinea.app.carto.com/maps
