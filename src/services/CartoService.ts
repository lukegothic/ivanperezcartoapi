// TODO: use absolute paths
import {
  Token,
  SQLQueryResponse,
  StationWithAggregatedMeasurement,
  GetStationMeasurementAggregatedParams,
  TimeSerieStep,
  SQLQueryParams,
  ExpirableToken
} from "../domain";

import {
  GCP_BASE,
  DATASET_CODETEST,
  DATASET_CODETEST_TABLE_AQMEASUREMENTS,
  DATASET_CODETEST_TABLE_AQSTATIONS,
  DATASET_WORLDPOP,
  DATASET_WORLDPOP_TABLE_GEOGRID,
  DATASET_WORLDPOP_TABLE_POPULATION
} from "../conf/CartoConf";

import axios, { AxiosInstance } from "axios";
/**
 * Gets an Auth Token to be used on the requests to the Query API.
 * @returns Auth Token
 */
const getToken = async (): Promise<Token> => {
  const client_data = {
    client_id: process.env.CARTO_CLIENT_ID,
    client_secret: process.env.CARTO_CLIENT_SECRET,
    grant_type: "client_credentials",
    audience: "carto-cloud-native-api"
  };
  const r_auth = await fetch("https://auth.carto.com/oauth/token", {
    method: "POST",
    body: new URLSearchParams(client_data),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
  return await r_auth.json();
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
 * Gets Axios preconfigured instance.
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
