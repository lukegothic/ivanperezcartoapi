import {
  GetStationMeasurementAggregatedParams,
  GetStationMeasurementAggregatedParamsRoute,
  GetStationMeasurementAggregatedParamsQS
} from "./domain";
import { getStationMeasurementAggregated } from "./services/CartoService";
import express, { Request } from "express";

const app = express();
const cartoRouter = express.Router();

cartoRouter
  .route("/measurements/:pollutant")
  .get(
    async (
      req: Request<GetStationMeasurementAggregatedParamsRoute, any, any, GetStationMeasurementAggregatedParamsQS>,
      res
    ) => {
      const params: GetStationMeasurementAggregatedParams = Object.assign({}, req.params, req.query);
      res.json(await getStationMeasurementAggregated(params));
    }
  );

app.use("/", cartoRouter);

const port = process.env.port ? parseInt(process.env.port) : 3003;
app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
