/**
 * @typedef {Object} StationWithAggregatedMeasurement
 * @property {string} station_id Station code
 * @property {number} pollutant_aggregated Aggregated value of the pollutant
 * @property {number} population Population affected by the station
 * This is the structure of the response to a request for Statistical measurement for stations
 */
export type StationWithAggregatedMeasurement = {
  station_id: string;
  pollutant_aggregated: number;
  population: number;
};
