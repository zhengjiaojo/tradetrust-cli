const fs = require("fs");
const path = require("path");
const { readCert } = require("./diskUtils");

const fileExtRegex = /(.*)(\.)(pdf)$/;

const isValidExt = filename => fileExtRegex.test(filename.toLowerCase());

const batchPdf = (pdfDir, certPath) => {
  const files = fs.readdirSync(pdfDir).filter(isValidExt);
  const document = readCert(certPath, "");

  if (!document.attachments) {
    document.attachments = [];
  }
  const attachmentLength = document.attachments.length;

  files.forEach((pdf, index) => {
    const content = fs.readFileSync(path.join(pdfDir, pdf)).toString("base64");

    let keyIndex = index;
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
  fs.writeFileSync(certPath, JSON.stringify(document, null, 2));
};

module.exports = batchPdf;
