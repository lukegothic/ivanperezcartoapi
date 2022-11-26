import { SQLAggregateFunction } from "./SQLAggregateFunction";
import { AirQualityPollutant } from "./AirQualityPollutant";
import { TimeSerieStep } from "./TimeSerieStep";

/**
 * @typedef {Object} GetStationMeasurementAggregatedTimeSerieParamsRoute
 * @property {AirQualityPollutant} pollutant Pollutant to get measurements from
 * Contains all the parameters from the express Route to be used on a getStationMeasurementAggregatedTimeSerie request
 */
export type GetStationMeasurementAggregatedTimeSerieParamsRoute = {
  pollutant: AirQualityPollutant;
};

/**
 * @typedef {Object} GetStationMeasurementAggregatedTimeSerieParamsQS
 * @property {SQLAggregateFunction} aggregate SQL Aggregate function
 * @property {string} datetime_start Start date of the measurements
 * @property {string} datetime_end End date of the measurements
 * Contains all the parameters from the queryString to be used on a getStationMeasurementAggregatedTimeSerie request
 */
export type GetStationMeasurementAggregatedTimeSerieParamsQS = {
  aggregate: SQLAggregateFunction;
  datetime_start: string;
  datetime_end: string;
  step: TimeSerieStep;
};

/**
 * @typedef {Object} GetStationMeasurementAggregatedTimeSerieParams
 * Contains all the parameters needed to perform a getStationMeasurementAggregatedTimeSerie request
 */
export type GetStationMeasurementAggregatedTimeSerieParams = GetStationMeasurementAggregatedTimeSerieParamsRoute &
  GetStationMeasurementAggregatedTimeSerieParamsQS;
