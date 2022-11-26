/**
 * @typedef Type
 */

type TimeSerieTimePart = {
  year?: number;
  month?: number;
  week?: number;
  day?: number;
  hour?: number;
};

export interface StationWithAggregatedMeasurementTimeSerieMeasure extends TimeSerieTimePart {
  pollutant_aggregated: number;
}

export type StationWithAggregatedMeasurementTimeSerieResponse = {
  station_id: string;
  measurements: StationWithAggregatedMeasurementTimeSerieMeasure[];
};

export interface StationWithAggregatedMeasurementTimeSerie extends TimeSerieTimePart {
  station_id: string;
  pollutant_aggregated: number;
}
