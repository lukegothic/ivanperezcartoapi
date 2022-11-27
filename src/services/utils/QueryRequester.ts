import { GCP_BASE, OAUTH_ENDPOINT, OAUTH_CREDENTIAL_TYPE } from "../../conf/CartoConf";
import { Token, ExpirableToken } from "../../domain";
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
export const getQueryRequester = async () => {
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
