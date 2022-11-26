import { StationWithAggregatedMeasurementTimeSerie, StationWithAggregatedMeasurementTimeSerieResponse } from "../../domain";
/**
 * @params {StationWithAggregatedMeasurementTimeSerie[]} rows
 * @returns
 */
export const groupStationMeasurementDataByStation = (
  rows: StationWithAggregatedMeasurementTimeSerie[]
): StationWithAggregatedMeasurementTimeSerieResponse[] => {
  return rows.reduce(
    (all_rows: StationWithAggregatedMeasurementTimeSerieResponse[], current_row: StationWithAggregatedMeasurementTimeSerie) => {
      const { station_id, ...measurement } = { ...current_row };
      const station_row = all_rows.find((s) => s.station_id === current_row.station_id);
      if (station_row) {
        station_row.measurements = station_row.measurements.concat(measurement);
        return all_rows;
      } else {
        return all_rows.concat({ station_id, measurements: [measurement] });
      }
    },
    []
  );
};
