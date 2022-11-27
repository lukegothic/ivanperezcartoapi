import * as dotenv from "dotenv";
dotenv.config();

import {
  GetStationMeasurementAggregatedParams,
  GetStationMeasurementAggregatedParamsRoute,
  GetStationMeasurementAggregatedParamsQS,
  GetStationMeasurementAggregatedTimeSerieParams,
  GetStationMeasurementAggregatedTimeSerieParamsRoute,
  GetStationMeasurementAggregatedTimeSerieParamsQS,
  SQLAggregateFunction,
  AirQualityPollutant,
  TimeSerieStep
} from "./domain";
import { getStationMeasurementAggregated, getStationMeasurementAggregatedTimeSerie } from "./services/CartoService";

import { check, param, query, validationResult } from "express-validator";
import express, { Request } from "express";

/**
 * Express application for this api
 */
const app = express();
/**
 * Router that handles requests to the api and maps them to the appropiate feature
 */
const cartoRouter = express.Router();

/**
 * Set-up a route for the first use case: Retrieve statistical measurement for stations.
 * The route for this feature is just /measurements/{pollutant} since it would make sense
 * to make a request to this endpoint to just retrieve the pure data, and in the future extend features from here.
 * The rest of the parameters are just either data aggregation (aggregate) or filtering (datetime_start and datetime_end).
 * Since the route is listening to GET requests, the rest of the parameters must be included in the querystring.
 * pollutant (from route):            domain/AirQualityPollutant (enum)
 * aggregate (from querystring):      domain/SQLAggregateFunction (enum)
 * datetime_start (from querystring): string in ISO-8601 date format
 * datetime_end (from querystring):   string in ISO-8601 date format
 * example request: /measurements/so2?aggregate=avg&datetime_start=2016-11-14T01:00:00.000Z&datetime_end=2016-11-30T22:30:00.000Z
 */
cartoRouter
  .route("/measurements/:pollutant")
  // Set-up the request to handle router params and query string params using our types
  .get(
    // Perform validation on params and querystring
    [
      param("pollutant").isIn(Object.values(AirQualityPollutant)),
      query("aggregate").exists().isIn(Object.values(SQLAggregateFunction)),
      query("datetime_start").exists().isISO8601(),
      query("datetime_end").exists().isISO8601()
    ],
    // The any types here are because we don't care about the ResBody, ReqBody or Res
    async (req: Request<GetStationMeasurementAggregatedParamsRoute, any, any, GetStationMeasurementAggregatedParamsQS>, res: any) => {
      const validation = validationResult(req);
      if (validation.isEmpty()) {
        // Merge both route params and query string params into a new object with all the data
        const params: GetStationMeasurementAggregatedParams = Object.assign({}, req.params, req.query);
        res.json(await getStationMeasurementAggregated(params));
      } else {
        res.status(400).json({ errors: validation.array() });
      }
    }
  );

/**
 * Set-up a route for the second use case: Timeserie for stations.
 * The route for this feature is /timeserie/{pollutant}
 * The rest of the parameters are just either data aggregation (aggregate, step) or filtering (datetime_start and datetime_end).
 * Since the route is listening to GET requests, the rest of the parameters must be included in the querystring.
 * pollutant (from route):            domain/AirQualityPollutant (enum)
 * aggregate (from querystring):      domain/SQLAggregateFunction (enum)
 * datetime_start (from querystring): string in ISO-8601 date format
 * datetime_end (from querystring):   string in ISO-8601 date format
 * step (from querystring):           domain/TimeSerieStep (enum)
 * example request: /timeserie/so2?aggregate=avg&datetime_start=2016-11-14T01:00:00.000Z&datetime_end=2016-11-30T22:30:00.000Z&step=day
 */
cartoRouter
  .route("/timeserie/:pollutant")
  // Set-up the request to handle router params and query string params using our types
  // Both the any types here are because we don't care about the ResBody or ReqBody
  .get(
    // Perform validation on params and querystring
    [
      param("pollutant").isIn(Object.values(AirQualityPollutant)),
      query("aggregate").exists().isIn(Object.values(SQLAggregateFunction)),
      query("datetime_start").exists().isISO8601(),
      query("datetime_end").exists().isISO8601(),
      query("step").exists().isIn(Object.values(TimeSerieStep))
    ],
    async (
      req: Request<GetStationMeasurementAggregatedTimeSerieParamsRoute, any, any, GetStationMeasurementAggregatedTimeSerieParamsQS>,
      res: any
    ) => {
      const validation = validationResult(req);
      if (validation.isEmpty()) {
        // Merge both route params and query string params into a new object with all the data
        const params: GetStationMeasurementAggregatedTimeSerieParams = Object.assign({}, req.params, req.query);
        // Call the service with the request params and return the response to the client as json
        res.json(await getStationMeasurementAggregatedTimeSerie(params));
      } else {
        res.status(400).json({ errors: validation.array() });
      }
    }
  );

/**
 * Register the router to be used with the Express app.
 * In this case, we point the router to the root of the api.
 * If at any point there are more business objects managed by this api
 * A new router should be created and each of them should point out to a different /path of the api
 */
app.use("/", cartoRouter);

/**
 * Begin listening to requests on the port configured on the environment or on a default port provided here (3003)
 */
const port = process.env.port ? parseInt(process.env.port) : 3003;
app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
