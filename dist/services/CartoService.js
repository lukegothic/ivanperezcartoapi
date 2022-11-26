"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStationMeasurementAggregatedTimeSeries = exports.getStationMeasurementAggregated = void 0;
const CartoConf_1 = require("../conf/CartoConf");
const axios_1 = __importDefault(require("axios"));
let cached_token = null;
const getToken = () => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: manage token expiration
    if (cached_token !== null) {
        return cached_token.access_token;
    }
    else {
        const client_data = {
            client_id: process.env.CARTO_CLIENT_ID,
            client_secret: process.env.CARTO_CLIENT_SECRET,
            grant_type: "client_credentials",
            audience: "carto-cloud-native-api"
        };
        // TODO: axios o fetch en todas las peticiones
        const r_auth = yield fetch("https://auth.carto.com/oauth/token", {
            method: "POST",
            body: new URLSearchParams(client_data),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        cached_token = yield r_auth.json();
        return cached_token.access_token;
    }
});
const getTokenAxios = () => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: manage token expiration
    if (cached_token !== null) {
        return cached_token.access_token;
    }
    else {
        const client_data = {
            client_id: process.env.CARTO_CLIENT_ID,
            client_secret: process.env.CARTO_CLIENT_SECRET,
            grant_type: "client_credentials",
            audience: "carto-cloud-native-api"
        };
        const { data } = yield axios_1.default.post("https://auth.carto.com/oauth/token", client_data, {
            responseType: "arraybuffer",
            responseEncoding: "binary",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        cached_token = data;
        return cached_token.access_token;
    }
});
const getStationMeasurementAggregated = ({ indicator, aggregate, timeinstant_from, timeinstant_to }) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield axios_1.default.get(`${CartoConf_1.BASE_URL}/v3/sql/carto_dw/query`, {
        params: {
            q: `select s.station_id, ${aggregate}(aq.${indicator}) as aggr 
            from ${CartoConf_1.DATASET}.${CartoConf_1.TABLE_AQSTATIONS} s left join ${CartoConf_1.DATASET}.${CartoConf_1.TABLE_AQMEASUREMENTS} aq on s.station_id = aq.station_id 
            where timeinstant between "${timeinstant_from}" and "${timeinstant_to}"
            group by s.station_id`
        },
        headers: {
            Authorization: `Bearer ${yield getTokenAxios()}`
        }
    });
    return data.rows;
});
exports.getStationMeasurementAggregated = getStationMeasurementAggregated;
const getStationMeasurementAggregatedTimeSeries = () => __awaiter(void 0, void 0, void 0, function* () { });
exports.getStationMeasurementAggregatedTimeSeries = getStationMeasurementAggregatedTimeSeries;
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
//# sourceMappingURL=CartoService.js.map