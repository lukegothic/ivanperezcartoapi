let chaiHttp = require("chai-http");
let chai = require("chai");
const expect = require("chai").expect;
const assert = require("chai").assert;

chai.use(chaiHttp);
const localApi = "http://localhost:3003";
const endpoint = "/measurements";

describe("Use Case 1: Statistical measurement for stations", () => {
  it("/measurements should be 404", (done) => {
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

  it("valid query should be 200 (aggregate = 'avg') and valid object", (done) => {
    chai
      .request(localApi)
      .get(`${endpoint}/co`)
      .query({ aggregate: "avg", datetime_start: "2016-11-14T01:00:00.000Z", datetime_end: "2016-11-30T22:30:00.000Z" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        assert.isArray(res.body);
        assert.isAbove(res.body.length, 0);
        const first = res.body[0];
        assert.hasAllKeys(res.body[0], ["station_id", "pollutant_aggregated", "population"]);
        assert.isString(first.station_id);
        assert.isNumber(first.pollutant_aggregated);
        assert.isNumber(first.population);
        done();
      });
  });

  it("valid query should be 200 (aggregate = 'min') and valid object", (done) => {
    chai
      .request(localApi)
      .get(`${endpoint}/co`)
      .query({ aggregate: "min", datetime_start: "2016-11-14T01:00:00.000Z", datetime_end: "2016-11-30T22:30:00.000Z" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        assert.isArray(res.body);
        assert.isAbove(res.body.length, 0);
        const first = res.body[0];
        assert.hasAllKeys(res.body[0], ["station_id", "pollutant_aggregated", "population"]);
        assert.isString(first.station_id);
        assert.isNumber(first.pollutant_aggregated);
        assert.isNumber(first.population);
        done();
      });
  });

  it("valid query should be 200 (aggregate = 'max') and valid object", (done) => {
    chai
      .request(localApi)
      .get(`${endpoint}/co`)
      .query({ aggregate: "max", datetime_start: "2016-11-14T01:00:00.000Z", datetime_end: "2016-11-30T22:30:00.000Z" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        assert.isArray(res.body);
        assert.isAbove(res.body.length, 0);
        const first = res.body[0];
        assert.hasAllKeys(res.body[0], ["station_id", "pollutant_aggregated", "population"]);
        assert.isString(first.station_id);
        assert.isNumber(first.pollutant_aggregated);
        assert.isNumber(first.population);
        done();
      });
  });

  it("valid query should be 200 (aggregate = 'count') and valid object", (done) => {
    chai
      .request(localApi)
      .get(`${endpoint}/co`)
      .query({ aggregate: "count", datetime_start: "2016-11-14T01:00:00.000Z", datetime_end: "2016-11-30T22:30:00.000Z" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        assert.isArray(res.body);
        assert.isAbove(res.body.length, 0);
        const first = res.body[0];
        assert.hasAllKeys(res.body[0], ["station_id", "pollutant_aggregated", "population"]);
        assert.isString(first.station_id);
        assert.isNumber(first.pollutant_aggregated);
        assert.isNumber(first.population);
        done();
      });
  });

  it("valid query should be 200 (aggregate = 'sum') and valid object", (done) => {
    chai
      .request(localApi)
      .get(`${endpoint}/co`)
      .query({ aggregate: "sum", datetime_start: "2016-11-14T01:00:00.000Z", datetime_end: "2016-11-30T22:30:00.000Z" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        assert.isArray(res.body);
        assert.isAbove(res.body.length, 0);
        const first = res.body[0];
        assert.hasAllKeys(res.body[0], ["station_id", "pollutant_aggregated", "population"]);
        assert.isString(first.station_id);
        assert.isNumber(first.pollutant_aggregated);
        assert.isNumber(first.population);
        done();
      });
  });

  it("datetime_end ('2015-11-14T01:00:00.000Z') earlier than datetime_start ('2016-11-14T01:00:00.000Z') should be 200 and empty", (done) => {
    chai
      .request(localApi)
      .get(`${endpoint}/co`)
      .query({ aggregate: "avg", datetime_start: "2016-11-14T01:00:00.000Z", datetime_end: "2015-11-14T01:00:00.000Z" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        assert.isArray(res.body);
        assert.strictEqual(res.body.length, 0);
        done();
      });
  });
});
