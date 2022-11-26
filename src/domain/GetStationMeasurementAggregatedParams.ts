import { SQLAggregateFunction } from "./SQLAggregateFunction";
import { AirQualityPollutant } from "./AirQualityPollutant";

/**
 * @typedef {Object} GetStationMeasurementAggregatedParamsRoute
 * @property {AirQualityPollutant} pollutant Pollutant to get measurements from
 * Contains all the parameters from the express Route to be used on a getStationMeasurementAggregated request
 */
export type GetStationMeasurementAggregatedParamsRoute = {
  pollutant: AirQualityPollutant;
};

/**
 * @typedef {Object} GetStationMeasurementAggregatedParamsQS
 * @property {SQLAggregateFunction} aggregate SQL Aggregate function
 * @property {string} datetime_start Start date of the measurements
 * @property {string} datetime_end End date of the measurements
 * Contains all the parameters from the queryString to be used on a getStationMeasurementAggregated request
 */
export type GetStationMeasurementAggregatedParamsQS = {
  aggregate: SQLAggregateFunction;
  datetime_start: string;
  datetime_end: string;
};

/**
 * @typedef {Object} GetStationMeasurementAggregatedParams
 * Contains all the parameters needed to perform a getStationMeasurementAggregated request
 */
export type GetStationMeasurementAggregatedParams = GetStationMeasurementAggregatedParamsRoute &
  GetStationMeasurementAggregatedParamsQS;
