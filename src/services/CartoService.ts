// TODO: doc project structure + methods
// TODO: use absolute paths
import {
  AirQualityPollutant,
  Token,
  SQLAggregateFunction,
  SQLQueryResponse,
  StationWithAggregatedMeasurement,
  TimeSerieStep,
  SQLQueryParams
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
 * Cached Token in memory
 */
let cached_token: Token = null;
/**
 * Gets an Auth Token to be used on the query api
 * @returns: string
 */
const getToken = async (): Promise<string> => {
  // TODO: manage token expiration
  if (cached_token !== null) {
    return cached_token.access_token;
  } else {
    const client_data = {
      client_id: process.env.CARTO_CLIENT_ID,
      client_secret: process.env.CARTO_CLIENT_SECRET,
      grant_type: "client_credentials",
      audience: "carto-cloud-native-api"
    };
    // TODO: axios o fetch en todas las peticiones
    const r_auth = await fetch("https://auth.carto.com/oauth/token", {
      method: "POST",
      body: new URLSearchParams(client_data),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    cached_token = await r_auth.json();
    return cached_token.access_token;
  }
};

let axiosCartoQueryRequester: AxiosInstance = null;
const getQueryRequester = async () => {
  if (axiosCartoQueryRequester === null) {
    axiosCartoQueryRequester = axios.create({
      baseURL: `${GCP_BASE}/v3/sql/carto_dw/query`,
      headers: {
        Authorization: `Bearer ${await getToken()}`
      }
    });
  }
  return axiosCartoQueryRequester;
};
/*
const getTokenAxios = async (): Promise<string> => {
  if (cached_token !== null) {
    return cached_token.access_token;
  } else {
    const client_data = {
      client_id: process.env.CARTO_CLIENT_ID,
      client_secret: process.env.CARTO_CLIENT_SECRET,
      grant_type: "client_credentials",
      audience: "carto-cloud-native-api"
    };
    const { data } = await axios.post<Token>("https://auth.carto.com/oauth/token", client_data, {
      responseType: "arraybuffer",
      responseEncoding: "binary",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    cached_token = data;
    return cached_token.access_token;
  }
};
*/
/**
 * @typedef {Object} GetStationMeasurementAggregatedParams
 * @property {AirQualityPollutant} pollutant Pollutant to get measurements from
 * @property {SQLAggregateFunction} aggregate SQL Aggregate function
 * @property {string} timeinstant_from XXXXXXXX
 * @property {string} timeinstant_to XXXXXXXXX
 * XXXXXXXX
 */
type GetStationMeasurementAggregatedParams = {
  pollutant: AirQualityPollutant;
  aggregate: SQLAggregateFunction;
  timeinstant_from: string;
  timeinstant_to: string;
};
/**
 * Gets a list of stations xxxx
 * @param {GetStationMeasurementAggregatedParams} param - {@link GetStationMeasurementAggregatedParams} object
 * containing all parameters needed to perform the request
 * @returns promise to be fulfilled with an array of XXXXXX
 */
export const getStationMeasurementAggregated = async ({
  pollutant,
  aggregate,
  timeinstant_from,
  timeinstant_to
}: GetStationMeasurementAggregatedParams): Promise<StationWithAggregatedMeasurement[]> => {
  const params: SQLQueryParams = {
    q: `SELECT s.station_id, ${aggregate}(aq.${pollutant}) AS pollutant_aggregated, p.population
        FROM ${DATASET_CODETEST}.${DATASET_CODETEST_TABLE_AQSTATIONS} s LEFT JOIN ${DATASET_CODETEST}.${DATASET_CODETEST_TABLE_AQMEASUREMENTS} aq ON s.station_id = aq.station_id,
        ${DATASET_WORLDPOP}.${DATASET_WORLDPOP_TABLE_GEOGRID} g LEFT JOIN ${DATASET_WORLDPOP}.${DATASET_WORLDPOP_TABLE_POPULATION} p ON g.geoid = p.geoid 
        WHERE timeinstant BETWEEN "${timeinstant_from}" AND "${timeinstant_to}"
        AND ST_CONTAINS(g.geom, s.geom)
        GROUP BY s.station_id, p.population`
  };
  const queryRequester = await getQueryRequester();
  const { data } = await queryRequester.request<SQLQueryResponse<StationWithAggregatedMeasurement>>(
    { params }
  );
  return data.rows;
};

/**
 * UC2: copied from
 */
interface GetStationMeasurementAggregatedTimeSerieParams
  extends GetStationMeasurementAggregatedParams {
  step: TimeSerieStep;
}

export const getStationMeasurementAggregatedTimeSerie = async ({
  pollutant,
  aggregate,
  timeinstant_from,
  timeinstant_to,
  step
}: GetStationMeasurementAggregatedTimeSerieParams): Promise<StationWithAggregatedMeasurement[]> => {
  const params: SQLQueryParams = {
    q: `SELECT s.station_id, ${aggregate}(aq.${pollutant}) AS pollutant_aggregated,
        FROM ${DATASET_CODETEST}.${DATASET_CODETEST_TABLE_AQSTATIONS} s LEFT JOIN ${DATASET_CODETEST}.${DATASET_CODETEST_TABLE_AQMEASUREMENTS} aq ON s.station_id = aq.station_id
        WHERE timeinstant BETWEEN "${timeinstant_from}" AND "${timeinstant_to}"
        GROUP BY s.station_id`
  };
  const queryRequester = await getQueryRequester();
  const { data } = await queryRequester.request<SQLQueryResponse<StationWithAggregatedMeasurement>>(
    { params }
  );
  return data.rows;
};
