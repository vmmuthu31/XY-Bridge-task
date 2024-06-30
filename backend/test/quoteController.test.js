import app from "../index.js";

let chai;

before(async () => {
  chai = await import("chai");
  const chaiHttp = await import("chai-http");
  chai = chai.default;
  chai.use(chaiHttp.default);
  chai.should();
});

describe("Quote Controller", () => {
  it("should GET a quote for a specified set of parameters", function (done) {
    this.timeout(8000);
    chai
      .request(app)
      .get("/api/quotes")
      .query({
        srcChainId: 42161,
        srcQuoteTokenAddress: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
        srcQuoteTokenAmount: "999000000",
        dstChainId: 59144,
        dstQuoteTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        slippage: 1,
      })
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          res.should.have.status(200);
          res.body.should.be.a("object");
          done();
        }
      });
  });
});
