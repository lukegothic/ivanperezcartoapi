import { getStationMeasurementAggregated } from "./services/CartoService";
import { AirQualityPollutant, SQLAggregateFunction } from "./domain";
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

cartoRouter.route("/timeserie").get(async (req, res) => {
  res.json(
    await getStationMeasurementAggregated({
      pollutant: AirQualityPollutant.SO2,
      aggregate: SQLAggregateFunction.AVG,
      timeinstant_from: "2016-12-11 10:30:00",
      timeinstant_to: "2016-12-11 11:30:00"
    })
  );
});

app.use("/", cartoRouter);

const port = process.env.port ? parseInt(process.env.port) : 3003;
app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
