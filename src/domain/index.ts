// index.ts
// Enables easy importing of all the types, interfaces and classes present in this folder
// To import any of them, it is just needed to point to the ./domain folder
export { AirQualityPollutant } from "./AirQualityPollutant";
export { ExpirableToken, Token } from "./Token";
export { GeometryPoint } from "./GeometryPoint";
export {
  GetStationMeasurementAggregatedParams,
  GetStationMeasurementAggregatedParamsRoute,
  GetStationMeasurementAggregatedParamsQS
} from "./GetStationMeasurementAggregatedParams";
export {
  GetStationMeasurementAggregatedTimeSerieParams,
  GetStationMeasurementAggregatedTimeSerieParamsRoute,
  GetStationMeasurementAggregatedTimeSerieParamsQS
} from "./GetStationMeasurementAggregatedTimeSerieParams";
export { SQLAggregateFunction } from "./SQLAggregateFunction";
export { SQLQueryParams } from "./SQLQueryParams";
export { SQLQueryResponse } from "./SQLQueryResponse";
export { Station } from "./Station";
export { StationMeasurement } from "./StationMeasurement";
export { StationWithAggregatedMeasurement } from "./StationWithAggregatedMeasurement";
export {
  StationWithAggregatedMeasurementTimeSerie,
  StationWithAggregatedMeasurementTimeSerieMeasure,
  StationWithAggregatedMeasurementTimeSerieResponse
} from "./StationWithAggregatedMeasurementTimeSerie";
export { TimeSerieStep } from "./TimeSerieStep";
