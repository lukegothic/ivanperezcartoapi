let chaiHttp = require("chai-http");
let chai = require("chai");
const expect = require("chai").expect;
const assert = require("chai").assert;

chai.use(chaiHttp);
const localApi = "http://localhost:3003";
const endpoint = "/timeserie";

describe("Use Case 2: Statistical measurement for stations as a time series", () => {
  it("/timeserie should be 404", (done) => {
    chai
      .request(localApi)
      .get(endpoint)
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  it("invalid pollutant (pm40) should be 400", (done) => {
    chai
      .request(localApi)
      .get(`${endpoint}/kk`)
      .query({})
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it("missing aggregate should be 400", (done) => {
    chai
      .request(localApi)
      .get(`${endpoint}/co`)
      .query({})
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it("invalid aggregate (med) should be 400", (done) => {
    chai
      .request(localApi)
      .get(`${endpoint}/co`)
      .query({ aggregate: "med" })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it("missing datetime_start should be 400", (done) => {
    chai
      .request(localApi)
      .get(`${endpoint}/co`)
      .query({ aggregate: "avg" })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it("invalid datetime_start (X) should be 400", (done) => {
    chai
      .request(localApi)
      .get(`${endpoint}/co`)
      .query({ aggregate: "avg", datetime_start: "X" })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it("missing datetime_end should be 400", (done) => {
    chai
      .request(localApi)
      .get(`${endpoint}/co`)
      .query({ aggregate: "avg", datetime_start: "2016-11-14T01:00:00.000Z" })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it("invalid datetime_end (X) should be 400", (done) => {
    chai
      .request(localApi)
      .get(`${endpoint}/co`)
      .query({ aggregate: "avg", datetime_start: "2016-11-14T01:00:00.000Z", datetime_end: "X" })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it("missing step should be 400", (done) => {
    chai
      .request(localApi)
      .get(`${endpoint}/co`)
      .query({ aggregate: "avg", datetime_start: "2016-11-14T01:00:00.000Z", datetime_end: "2016-11-30T22:30:00.000Z" })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it("invalid step (decade) should be 400", (done) => {
    chai
      .request(localApi)
      .get(`${endpoint}/co`)
      .query({ aggregate: "avg", datetime_start: "2016-11-14T01:00:00.000Z", datetime_end: "2016-11-30T22:30:00.000Z", step: "decade" })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it("valid query should be 200 (step = 'year') and valid object", (done) => {
    chai
      .request(localApi)
      .get(`${endpoint}/co`)
      .query({ aggregate: "avg", datetime_start: "2016-11-14T01:00:00.000Z", datetime_end: "2016-11-30T22:30:00.000Z", step: "year" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        assert.isArray(res.body);
        assert.isAbove(res.body.length, 0);
        const first = res.body[0];
        assert.hasAllKeys(first, ["station_id", "measurements"]);
        assert.isString(first.station_id);
        assert.isArray(first.measurements);
        assert.isAbove(first.measurements.length, 0);
        const first_measurements = res.body[0].measurements[0];
        assert.hasAllKeys(first_measurements, ["pollutant_aggregated", "year"]);
        assert.isNumber(first_measurements.pollutant_aggregated);
        assert.isNumber(first_measurements.year);
        done();
      });
  });

  it("valid query should be 200 (step = 'month') and valid object", (done) => {
    chai
      .request(localApi)
      .get(`${endpoint}/co`)
      .query({ aggregate: "avg", datetime_start: "2016-11-14T01:00:00.000Z", datetime_end: "2016-11-30T22:30:00.000Z", step: "month" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        assert.isArray(res.body);
        assert.isAbove(res.body.length, 0);
        const first = res.body[0];
        assert.hasAllKeys(first, ["station_id", "measurements"]);
        assert.isString(first.station_id);
        assert.isArray(first.measurements);
        assert.isAbove(first.measurements.length, 0);
        const first_measurements = res.body[0].measurements[0];
        assert.hasAllKeys(first_measurements, ["pollutant_aggregated", "year", "month"]);
        assert.isNumber(first_measurements.pollutant_aggregated);
        assert.isNumber(first_measurements.year);
        assert.isNumber(first_measurements.month);
        done();
      });
  });

  it("valid query should be 200 (step = 'week') and valid object", (done) => {
    chai
      .request(localApi)
      .get(`${endpoint}/co`)
      .query({ aggregate: "avg", datetime_start: "2016-11-14T01:00:00.000Z", datetime_end: "2016-11-30T22:30:00.000Z", step: "week" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        assert.isArray(res.body);
        assert.isAbove(res.body.length, 0);
        const first = res.body[0];
        assert.hasAllKeys(first, ["station_id", "measurements"]);
        assert.isString(first.station_id);
        assert.isArray(first.measurements);
        assert.isAbove(first.measurements.length, 0);
        const first_measurements = res.body[0].measurements[0];
        assert.hasAllKeys(first_measurements, ["pollutant_aggregated", "year", "week"]);
        assert.isNumber(first_measurements.pollutant_aggregated);
        assert.isNumber(first_measurements.year);
        assert.isNumber(first_measurements.week);
        done();
      });
  });

  it("valid query should be 200 (step = 'day') and valid object", (done) => {
    chai
      .request(localApi)
      .get(`${endpoint}/co`)
      .query({ aggregate: "avg", datetime_start: "2016-11-14T01:00:00.000Z", datetime_end: "2016-11-30T22:30:00.000Z", step: "day" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        assert.isArray(res.body);
        assert.isAbove(res.body.length, 0);
        const first = res.body[0];
        assert.hasAllKeys(first, ["station_id", "measurements"]);
        assert.isString(first.station_id);
        assert.isArray(first.measurements);
        assert.isAbove(first.measurements.length, 0);
        const first_measurements = res.body[0].measurements[0];
        assert.hasAllKeys(first_measurements, ["pollutant_aggregated", "year", "month", "day"]);
        assert.isNumber(first_measurements.pollutant_aggregated);
        assert.isNumber(first_measurements.year);
        assert.isNumber(first_measurements.month);
        assert.isNumber(first_measurements.day);
        done();
      });
  });

  it("valid query should be 200 (step = 'hour') and valid object", (done) => {
    chai
      .request(localApi)
      .get(`${endpoint}/co`)
      .query({ aggregate: "avg", datetime_start: "2016-11-14T01:00:00.000Z", datetime_end: "2016-11-30T22:30:00.000Z", step: "hour" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        assert.isArray(res.body);
        assert.isAbove(res.body.length, 0);
        const first = res.body[0];
        assert.hasAllKeys(first, ["station_id", "measurements"]);
        assert.isString(first.station_id);
        assert.isArray(first.measurements);
        assert.isAbove(first.measurements.length, 0);
        const first_measurements = res.body[0].measurements[0];
        assert.hasAllKeys(first_measurements, ["pollutant_aggregated", "year", "month", "day", "hour"]);
        assert.isNumber(first_measurements.pollutant_aggregated);
        assert.isNumber(first_measurements.year);
        assert.isNumber(first_measurements.month);
        assert.isNumber(first_measurements.day);
        assert.isNumber(first_measurements.hour);
        done();
      });
  });

  it("datetime_end ('2015-11-14T01:00:00.000Z') earlier than datetime_start ('2016-11-14T01:00:00.000Z') should be 200", (done) => {
    chai
      .request(localApi)
      .get(`${endpoint}/co`)
      .query({ aggregate: "avg", datetime_start: "2016-11-14T01:00:00.000Z", datetime_end: "2015-11-14T01:00:00.000Z", step: "day" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        assert.isArray(res.body);
        assert.strictEqual(res.body.length, 0);
        done();
      });
  });
});
