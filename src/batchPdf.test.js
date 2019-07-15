const certUrl = "./test/fixtures/undigestedCerts/example.0.json";
const pdfUrl = "./test/fixtures/pdf";
const batchPdf = require("./batchPdf");
const { readCert } = require("./diskUtils");
const fs = require("fs");

describe("batchPdf", () => {
  afterEach(done => {
    fs.readFile(certUrl, "utf8", (err, fileContents) => {
      if (err) throw err;
      const tests = JSON.parse(fileContents);
      delete tests.attachments;
      fs.writeFileSync(certUrl, JSON.stringify(tests, null, 4));
      done();
    });
  });

  it("should bathcPdf when there is only one pdf file", () => {
    batchPdf(pdfUrl, certUrl);
    const cert = readCert("./test/fixtures/undigestedCerts/", "example.0.json");
    expect(cert).to.have.property("attachments");
    expect(cert.attachments).to.have.lengthOf(1);
  });

  it("should bathcPdf when there is already attachments", () => {
    for (let i = 0; i < 3; i += 1) {
      batchPdf(pdfUrl, certUrl);
    }
    const cert = readCert("./test/fixtures/undigestedCerts/", "example.0.json");
    expect(cert).to.have.property("attachments");
    expect(cert.attachments).to.have.lengthOf(3);
  });
});
