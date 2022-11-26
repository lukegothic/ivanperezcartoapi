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
const express_1 = __importDefault(require("express"));
const CartoService_1 = require("./services/CartoService");
const app = (0, express_1.default)();
const cartoRouter = express_1.default.Router();
cartoRouter.route("/carto").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(yield (0, CartoService_1.getStationMeasurementAggregated)({
        indicator: "so2",
        aggregate: "avg",
        timeinstant_from: "2016-12-11 10:30:00",
        timeinstant_to: "2016-12-11 11:30:00",
    }));
}));
app.use("/", cartoRouter);
const port = process.env.port ? parseInt(process.env.port) : 3003;
app.listen(port, () => {
    console.log(`API running on port ${port}`);
});
//# sourceMappingURL=index.js.map