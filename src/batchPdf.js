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
  let keyIndex = 0;
  if (!document.attachments) {
    document.attachments = [];
  }
  const attachmentLength = document.attachments.length;

  files.forEach((pdf, index) => {
    const content = fs.readFileSync(path.join(pdfDir, pdf)).toString("base64");

    if (attachmentLength > index) {
      keyIndex = attachmentLength + index;
    }

    document.attachments[keyIndex] = {
      filename: "",
      type: "application/pdf",
      data: null
    };

    document.attachments[keyIndex].filename = pdf;
    document.attachments[keyIndex].data = content;
  });
  fs.writeFileSync(certPath, JSON.stringify(document, null, 4));
};

module.exports = batchPdf;
