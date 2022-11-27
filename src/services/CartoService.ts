import {
  SQLQueryParams,
  SQLQueryResponse,
  StationWithAggregatedMeasurement,
  StationWithAggregatedMeasurementTimeSerie,
  StationWithAggregatedMeasurementTimeSerieResponse,
  GetStationMeasurementAggregatedParams,
  GetStationMeasurementAggregatedTimeSerieParams,
  Token,
  ExpirableToken
} from "../domain";

import {
  GCP_BASE,
  DATASET_CODETEST,
  DATASET_CODETEST_TABLE_AQMEASUREMENTS,
  DATASET_CODETEST_TABLE_AQSTATIONS,
  DATASET_WORLDPOP,
  DATASET_WORLDPOP_TABLE_GEOGRID,
  DATASET_WORLDPOP_TABLE_POPULATION,
  OAUTH_ENDPOINT,
  OAUTH_CREDENTIAL_TYPE
} from "../conf/CartoConf";

import { groupStationMeasurementDataByStation } from "./utils/StationMeasurementsTimeSerie";
import { DateTimeParts } from "./utils/TimeSerieStep";
import axios, { AxiosInstance } from "axios";
/**
 * Gets an Auth Token to be used on the requests to the Query API.
 * @returns Auth Token
 */
const getToken = async (): Promise<Token> => {
  /**
   * To be able to access data that must be kept private,
   * I've chosen to keep and read them from environment variables
   * client_id is read from CARTO_CLIENT_ID and client_secret is read from CARTO_CLIENT_SECRET
   */
  const { data } = await axios.post<Token>(
    OAUTH_ENDPOINT,
    new URLSearchParams({
      client_id: process.env.CARTO_CLIENT_ID,
      client_secret: process.env.CARTO_CLIENT_SECRET,
      grant_type: OAUTH_CREDENTIAL_TYPE,
      audience: "carto-cloud-native-api"
    })
  );
  return data;
};
/**
 * Cached Auth Token
 */
let auth_token: ExpirableToken = null;
/**
 * Axios preconfigured instance to perform requests to Carto's SQL Cloud Platform endpoint.
 */
let axiosCartoQueryRequester: AxiosInstance = null;
/**
 * Set-up and get an Axios preconfigured instance.
 * If auth_token has expired, requests a new token for the Authorization header and creates a new instance.
 * @returns New Axios Instance or Cached Axios Instance
 */
const getQueryRequester = async () => {
  if (auth_token === null || auth_token.isExpired()) {
    auth_token = new ExpirableToken(await getToken());
    axiosCartoQueryRequester = axios.create({
      baseURL: `${GCP_BASE}/v3/sql/carto_dw/query`,
      headers: {
        Authorization: `Bearer ${auth_token.access_token}`
      }
    });
  }
  return axiosCartoQueryRequester;
};

/**
 * Gets a list of stations with station_id, request aggregate of the requested pollutant and population affected by the station
 * filtered by a date range
 * @param {GetStationMeasurementAggregatedParams} param -- {@link GetStationMeasurementAggregatedParams} object
 * containing all parameters needed to perform the request
 * @returns {Promise<StationWithAggregatedMeasurement[]>} Promise object representing
 * an Array of {@link StationWithAggregatedMeasurement}
 */
export const getStationMeasurementAggregated = async ({
  pollutant,
  aggregate,
  datetime_start,
  datetime_end
}: GetStationMeasurementAggregatedParams): Promise<StationWithAggregatedMeasurement[]> => {
  /**
   * We retrieve two different kinds of information on this query:
   * [Aggregation of a pollutant by datetime range]
   * We obtain the chosen AirQualityPollutant aggregation by just joining the Stations table with the Measurements table
   * and then performing an aggregation using the provided SQLAggregator. Measurements are filtered by the provided datetime range.
   * [Population data]
   * This data is stored inside a Population table related to a spatial table, but not directly to the Stations table.
   * Since we have a spatial component inside the Stations table we are able to spatial-join with the Spatial Grid table
   * using the spatial Function ST_CONTAINS, and then since the spatial table and the population tables are related, we have access to the population data.
   */
  const params: SQLQueryParams = {
    q: `SELECT s.station_id, ${aggregate}(aq.${pollutant}) AS pollutant_aggregated, p.population
        FROM ${DATASET_CODETEST}.${DATASET_CODETEST_TABLE_AQSTATIONS} s LEFT JOIN ${DATASET_CODETEST}.${DATASET_CODETEST_TABLE_AQMEASUREMENTS} aq ON s.station_id = aq.station_id,
        ${DATASET_WORLDPOP}.${DATASET_WORLDPOP_TABLE_GEOGRID} g LEFT JOIN ${DATASET_WORLDPOP}.${DATASET_WORLDPOP_TABLE_POPULATION} p ON g.geoid = p.geoid 
        WHERE timeinstant BETWEEN "${datetime_start}" AND "${datetime_end}"
        AND ST_CONTAINS(g.geom, s.geom)
        GROUP BY s.station_id, p.population`
  };
  const queryRequester = await getQueryRequester();
  const { data } = await queryRequester.request<SQLQueryResponse<StationWithAggregatedMeasurement>>({ params });
  return data.rows;
};

/**
 * Gets a list of stations with station_id and an array of measurements grouped by timepart
 * filtered by a date range
 * @param {GetStationMeasurementAggregatedTimeSerieParams} param -- {@link GetStationMeasurementAggregatedTimeSerieParams} object
 * containing all parameters needed to perform the request
 * @returns {Promise<StationWithAggregatedMeasurementTimeSerie[]>} Promise object representing
 * an Array of {@link StationWithAggregatedMeasurementTimeSerie}
 */
export const getStationMeasurementAggregatedTimeSerie = async ({
  pollutant,
  aggregate,
  datetime_start,
  datetime_end,
  step
}: GetStationMeasurementAggregatedTimeSerieParams): Promise<StationWithAggregatedMeasurementTimeSerieResponse[]> => {
  /**
   * Each step type has an array of dependencies for the grouping of data to be able to work properly
   * for example: "week" step needs the grouping to be done by year and by week
   */
  const stepDateTimeParts = DateTimeParts.get(step);
  /**
   * By knowing the array of dependencies enables us to only request, group and order the data just by the needed datetime parts
   * In detail, each date part affects how many EXTRACT, GROUP BY and ORDER BY are generated on the query,
   * so this helps it to be as optimized as possible.
   * Without it, we would have to include every datetime part and then post-process the response to include only the relevant fields
   */
  const params: SQLQueryParams = {
    q: `SELECT s.station_id, ${aggregate}(aq.${pollutant}) AS pollutant_aggregated, 
        ${stepDateTimeParts.map((sdtp) => `EXTRACT(${sdtp} FROM CAST (aq.timeinstant AS TIMESTAMP)) AS ${sdtp}`).join(", ")}
        FROM ${DATASET_CODETEST}.${DATASET_CODETEST_TABLE_AQSTATIONS} s LEFT JOIN ${DATASET_CODETEST}.${DATASET_CODETEST_TABLE_AQMEASUREMENTS} aq ON s.station_id = aq.station_id
        WHERE timeinstant BETWEEN "${datetime_start}" AND "${datetime_end}"
        GROUP BY s.station_id, ${stepDateTimeParts.join(", ")} ORDER BY s.station_id, ${stepDateTimeParts.join(", ")}`
  };
  const queryRequester = await getQueryRequester();
  const { data } = await queryRequester.request<SQLQueryResponse<StationWithAggregatedMeasurementTimeSerie>>({ params });
  /**
   * The data is received properly, grouped using the datetime parts corresponding to the specified step,
   * but we observe that for each station and grouping there is a data row.
   * Since in the end we should only need one row for each station, to display the data properly,
   * we model, transform and optimize the data in the following way:
   * Each station is a row of data, and that row includes the station_id and an Array of measurements.
   * Each measurement inside the Array has the datetime parts and the pollutant_aggregated.
   */
  return groupStationMeasurementDataByStation(data.rows);
};
