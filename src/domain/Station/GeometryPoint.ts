/**
 * @typedef {Object} GeometryPoint
 * @property {string} type Geometry type
 * @property {number[]} coordinates Location of the geometry, tuple of [longitude, latitude]
 * Models a geometrical point
 */
export type GeometryPoint = {
  type: "Point";
  coordinates: number[];
};
