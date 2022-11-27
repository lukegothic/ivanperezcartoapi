/**
 * @typedef {Object} StationMeasurement
 * @property {number} id Measurement id
 * @property {string} station_id Station code
 * @property {string} timeinstant Datetime of the observation
 * @property {number} so2 so2 measurement
 * @property {number} no2 no2 measurement
 * @property {number} pm10 pm10 measurement
 * @property {number} pm2_5 pm2_5 measurement
 * @property {number} co co measurement
 * @property {number} o3 o3 measurement
 * @property {string} created_at Datetime in which the information was created
 * @property {string} updated_at Datetime in which the information was updated
 *
 * This is the structure of a StationMeasurement inside the Measurements table
 */
export type StationMeasurement = {
  id: number;
  station_id: string;
  timeinstant: string;
  so2: number;
  no2: number;
  pm10: number;
  pm2_5: number;
  co: number;
  o3: number;
  created_at: string;
  updated_at: string;
};
