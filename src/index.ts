import { getStationMeasurementAggregated } from "./services/CartoService";
import { GetStationMeasurementAggregatedParams } from "./domain";
import express, { Request } from "express";

const app = express();
const cartoRouter = express.Router();

// TODO: decide on full route path vs route and querystring for dates
cartoRouter
  .route("/measurements/:pollutant/aggregate/:aggregate/:timeinstant_from/:timeinstant_to")
  .get(async (req: Request<GetStationMeasurementAggregatedParams>, res) => {
    res.json(await getStationMeasurementAggregated(req.params));
  });

app.use("/", cartoRouter);

const port = process.env.port ? parseInt(process.env.port) : 3003;
app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
