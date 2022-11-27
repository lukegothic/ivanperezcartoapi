const chaiHttp = require("chai-http");
const chai = require("chai");
const expect = require("chai").expect;

chai.use(chaiHttp);
const localApi = "http://localhost:3003";

describe("General Cases", () => {
  it("api root (/) should be 404", (done) => {
    chai
      .request(localApi)
      .get("/")
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
});
