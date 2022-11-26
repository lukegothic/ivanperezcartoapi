import { SQLAggregateFunction } from "./SQLAggregateFunction";
import { AirQualityPollutant } from "./AirQualityPollutant";

/**
 * @typedef {Object} GetStationMeasurementAggregatedParams
 * @property {AirQualityPollutant} pollutant Pollutant to get measurements from
 * @property {SQLAggregateFunction} aggregate SQL Aggregate function
 * @property {string} timeinstant_from Min date of the measurements
 * @property {string} timeinstant_to Max date of the measurements
 * Contains all the parameters needed to perform a getStationMeasurementAggregated request
 */
export type GetStationMeasurementAggregatedParams = {
  pollutant: AirQualityPollutant;
  aggregate: SQLAggregateFunction;
  timeinstant_from: string;
  timeinstant_to: string;
};
