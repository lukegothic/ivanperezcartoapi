// TODO: doc project structure + methods
// TODO: use absolute paths
import {
  AirQualityPollutant,
  Token,
  SQLAggregateFunction,
  SQLQueryResponse,
  StationWithAggregatedMeasurement
} from "../domain";
import { BASE_URL, DATASET, TABLE_AQSTATIONS, TABLE_AQMEASUREMENTS } from "../conf/CartoConf";

import axios from "axios";

let cached_token: Token = null;
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

const getTokenAxios = async (): Promise<string> => {
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

type GetStationMeasurementAggregatedParams = {
  pollutant: AirQualityPollutant;
  aggregate: SQLAggregateFunction;
  timeinstant_from: string;
  timeinstant_to: string;
};

export const getStationMeasurementAggregated = async ({
  pollutant,
  aggregate,
  timeinstant_from,
  timeinstant_to
}: GetStationMeasurementAggregatedParams): Promise<StationWithAggregatedMeasurement[]> => {
  const { data } = await axios.get<SQLQueryResponse<StationWithAggregatedMeasurement>>(
    `${BASE_URL}/v3/sql/carto_dw/query`,
    {
      params: {
        q: `select s.station_id, ${aggregate}(aq.${pollutant}) as pollutant_aggregate 
            from ${DATASET}.${TABLE_AQSTATIONS} s left join ${DATASET}.${TABLE_AQMEASUREMENTS} aq on s.station_id = aq.station_id 
            where timeinstant between "${timeinstant_from}" and "${timeinstant_to}"
            group by s.station_id`
      },
      headers: {
        Authorization: `Bearer ${await getToken()}`
      }
    }
  );
  return data.rows;
};

export const getStationMeasurementAggregatedTimeSeries = async () => {};

/*
      const resp = await axios.post(
        "https://auth.carto.com/oauth/token",
        {
          client_id: process.env.CARTO_CLIENT_ID,
          client_secret: process.env.CARTO_CLIENT_SECRET,
          grant_type: "client_credentials",
          audience: "carto-cloud-native-api",
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );
      carto_token = resp.data.access_token;
      */
