import { GeometryPoint } from "./GeometryPoint";

/**
 * @typedef {Object} Station
 * @property {GeometryPoint} geom Location of the station
 * @property {string} station_id Station code
 * @property {string} created_at Datetime in which the information was created
 * @property {string} updated_at Datetime in which the information was updated
 * This is the structure of a Station inside the Stations table
 */
export type Station = {
  geom: GeometryPoint;
  station_id: string;
  created_at: string;
  updated_at: string;
};
