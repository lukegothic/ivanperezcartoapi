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
