const fs = require("fs");
const util = require("util");
const path = require("path");
const { filter, some } = require("lodash");

const readdir = util.promisify(fs.readdir);

const tradetrustFileExtensions = [/(.*)(\.)(tt)$/, /(.*)(\.)(json)$/];

function readCert(directory, filename) {
  return JSON.parse(fs.readFileSync(path.join(directory, filename)));
}

function isTradetrustFileExtension(filename) {
  return some(
    tradetrustFileExtensions.map(mask => mask.test(filename.toLowerCase()))
  );
}

const certificatesInDirectory = async dir => {
  const items = await readdir(dir);
  return filter(items, isTradetrustFileExtension);
};

function writeCertToDisk(destinationDir, filename, certificate) {
  fs.writeFileSync(
    path.join(path.resolve(destinationDir), filename),
    JSON.stringify(certificate, null, 2)
  );
}

module.exports = {
  certificatesInDirectory,
  writeCertToDisk,
  readCert,
  readdir
};
