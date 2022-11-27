/**
 * @typedef {Object} TimeSerieTimePart
 * @property {number?} year Year of the measurement
 * @property {number?} month Month of the measurement
 * @property {number?} week Week of the measurement
 * @property {number?} day Day of the measurement
 * @property {number?} hour Hour of the measurement
 * Contains all the datetime part properties a measurement can have.
 */
type TimeSerieTimePart = {
  year?: number;
  month?: number;
  week?: number;
  day?: number;
  hour?: number;
};

/**
 * @typedef {Object} StationWithAggregatedMeasurementTimeSerieMeasure
 * @property {number} pollutant_aggregated Aggregated value of the pollutant
 * Contains the aggregated value of the pollutant and all the datetime part properties that a measurement can have.
 * Matches an aggregated value with a datetime part grouping
 */
export interface StationWithAggregatedMeasurementTimeSerieMeasure extends TimeSerieTimePart {
  pollutant_aggregated: number;
}

/**
 * @typedef {Object} StationWithAggregatedMeasurementTimeSerie
 * @property {string} station_id Station code
 * @property {number} pollutant_aggregated Aggregated value of the pollutant
 * Contains the station, the aggregated value of the pollutant and all the datetime part properties that a measurement can have.
 * This is the structure from the query without performing any transformation
 */
export interface StationWithAggregatedMeasurementTimeSerie extends TimeSerieTimePart {
  station_id: string;
  pollutant_aggregated: number;
}

/**
 * @typedef {Object} StationWithAggregatedMeasurementTimeSerieResponse
 * @property {string} station_id Station code
 * @property {StationWithAggregatedMeasurementTimeSerieMeasure[]} measurements Array of measurements with n datetime parts
 * Contains the station and an Array of measurements with n datetime parts
 * This is the structure of the response to a request for Timeserie for stations after performing the transformation
 * from having multiple rows for each station to grouping stations
 */
export type StationWithAggregatedMeasurementTimeSerieResponse = {
  station_id: string;
  measurements: StationWithAggregatedMeasurementTimeSerieMeasure[];
};
