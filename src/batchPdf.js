const { some } = require("lodash");
const fs = require("fs");
const path = require("path");
const { readCert } = require("./diskUtils");

const fileExt = [/(.*)(\.)(pdf)$/];

const isValidExt = filename =>
  some(fileExt.map(ext => ext.test(filename.toLowerCase())));

const batchPdf = (pdfDir, certPath) => {
  const files = fs.readdirSync(pdfDir).filter(isValidExt);
  const document = readCert(certPath, "");
  files.forEach((pdf, index) => {
    const content = fs.readFileSync(path.join(pdfDir, pdf)).toString("base64");
    if (!document.attachment) {
      document.attachment = [];
    }
    document.attachment[index] = {
      filename: "",
      type: "application/pdf",
      data: null
    };
    document.attachment[index].filename = pdf;
    document.attachment[index].data = content;
    return content;
  });
  fs.writeFileSync(certPath, JSON.stringify(document, null, 4));
};

module.exports = batchPdf;
