import {
  getStationMeasurementAggregated,
  getStationMeasurementAggregatedTimeSerie
} from "./services/CartoService";
import { AirQualityPollutant, SQLAggregateFunction, TimeSerieStep } from "./domain";
import express from "express";

const app = express();
const cartoRouter = express.Router();

cartoRouter.route("/measure").get(async (req, res) => {
  res.json(
    await getStationMeasurementAggregated({
      pollutant: AirQualityPollutant.SO2,
      aggregate: SQLAggregateFunction.AVG,
      timeinstant_from: "2016-12-11 10:30:00",
      timeinstant_to: "2016-12-11 11:30:00"
    })
  );
});

//select s.station_id, avg(aq.so2) as aggr from cartodb-gcp-backend-data-team.code_test.airquality_stations s left join cartodb-gcp-backend-data-team.code_test.airquality_measurements aq on s.station_id = aq.station_id where timeinstant between "2016-12-11 10:30:00" and "2016-12-11 11:30:00" group by s.station_id
//select s.station_id, g.geoid from cartodb-gcp-backend-data-team.code_test.airquality_stations s, carto-data.ac_1uzlc7pq.sub_worldpop_geography_esp_grid100m_v1 g where st_contains(g.geom, s.geom)

cartoRouter.route("/timeserie").get(async (req, res) => {
  res.json(
    await getStationMeasurementAggregatedTimeSerie({
      pollutant: AirQualityPollutant.SO2,
      aggregate: SQLAggregateFunction.AVG,
      timeinstant_from: "2016-12-11 10:30:00",
      timeinstant_to: "2016-12-11 11:30:00",
      step: TimeSerieStep.WEEK
    })
  );
});

app.use("/", cartoRouter);

const port = process.env.port ? parseInt(process.env.port) : 3003;
app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
