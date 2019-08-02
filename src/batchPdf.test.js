const certUrl = "./test/fixtures/undigestedCerts/example.0.json";
const pdfUrl = "./test/fixtures/pdf";
const batchPdf = require("./batchPdf");
const { readCert } = require("./diskUtils");
const fs = require("fs");
const tmp = require("tmp");

describe("batchPdf", () => {
  let tempFile = null;
  before(done => {
    tempFile = tmp.fileSync();

    fs.readFile(certUrl, "utf8", (err, fileContents) => {
      if (err) throw err;
      const tests = JSON.parse(fileContents);
      fs.writeFileSync(tempFile.name, JSON.stringify(tests, null, 2));
      done();
    });
  });

  after(done => {
    tempFile.removeCallback();
    done();
  });

  it("should create the attachments array and append one PDF file", () => {
    batchPdf(pdfUrl, tempFile.name);
    const cert = readCert(tempFile.name, "");
    expect(cert).to.have.property("attachments");
    expect(cert.attachments).to.have.lengthOf(1);
  });

  it("should append new attachments to existing attachments", () => {
    for (let i = 0; i < 2; i += 1) {
      batchPdf(pdfUrl, tempFile.name);
    }
    const cert = readCert(tempFile.name, "");
    expect(cert).to.have.property("attachments");
    expect(cert.attachments).to.have.lengthOf(3);
  });
});
