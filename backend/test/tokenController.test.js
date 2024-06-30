import app from "../index.js";
let chai;

before(async () => {
  chai = await import("chai");
  const chaiHttp = await import("chai-http");
  chai = chai.default;
  chai.use(chaiHttp.default);
  chai.should();
});

describe("Token Controller", () => {
  it("should GET all supported chains", (done) => {
    chai
      .request(app)
      .get("/api/chains")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        done();
      });
  });

  it("should GET recommended tokens for a specified chain", (done) => {
    const chainId = 1;
    chai
      .request(app)
      .get(`/api/recommendedtokens?chainId=${chainId}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        done();
      });
  });

  it("should GET all supported bridge providers", (done) => {
    chai
      .request(app)
      .get("/api/bridgeProviders")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        done();
      });
  });
});
