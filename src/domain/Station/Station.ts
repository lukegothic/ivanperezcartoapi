import { GeometryPoint } from "./GeometryPoint";

export type Station = {
  geom: GeometryPoint;
  station_id: string;
  created_at: string;
  updated_at: string;
};
