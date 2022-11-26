// index.ts
// Enables easy importing of all the types, interfaces and classes present in this folder
// To import any of them, it is just needed to point to the ./domain folder
export { AirQualityPollutant } from "./Service/domain/AirQualityPollutant";
export { ExpirableToken, Token } from "./Auth/Token";
export {
  GetStationMeasurementAggregatedParams,
  GetStationMeasurementAggregatedParamsRoute,
  GetStationMeasurementAggregatedParamsQS
} from "./Service/GetStationMeasurementAggregatedParams";
export {
  GetStationMeasurementAggregatedTimeSerieParams,
  GetStationMeasurementAggregatedTimeSerieParamsRoute,
  GetStationMeasurementAggregatedTimeSerieParamsQS
} from "./Service/GetStationMeasurementAggregatedTimeSerieParams";
export { SQLAggregateFunction } from "./Service/domain/SQLAggregateFunction";
export { SQLQueryParams } from "./BigQuery/SQLQueryParams";
export { SQLQueryResponse } from "./BigQuery/SQLQueryResponse";
export { StationMeasurement } from "./StationMeasurement/StationMeasurement";
export { StationWithAggregatedMeasurement } from "./Service/StationWithAggregatedMeasurement";
export {
  StationWithAggregatedMeasurementTimeSerie,
  StationWithAggregatedMeasurementTimeSerieMeasure,
  StationWithAggregatedMeasurementTimeSerieResponse
} from "./Service/StationWithAggregatedMeasurementTimeSerie";
export { TimeSerieStep } from "./Service/domain/TimeSerieStep";
