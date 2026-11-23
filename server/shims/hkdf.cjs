const crypto = require("node:crypto");

function normalizeUint8Array(input, label) {
  if (typeof input === "string") return new TextEncoder().encode(input);
  if (!(input instanceof Uint8Array)) {
    return new TextEncoder().encode(String(input || ""));
  }
  return input;
}

async function hkdf(digest, ikm, salt, info, keylen) {
  return new Promise((resolve, reject) => {
    crypto.hkdf(
      digest,
      normalizeUint8Array(ikm, "ikm"),
      normalizeUint8Array(salt, "salt"),
      normalizeUint8Array(info, "info"),
      keylen,
      (err, arrayBuffer) => {
        if (err) reject(err);
        else resolve(new Uint8Array(arrayBuffer));
      },
    );
  });
}

hkdf.default = hkdf;
hkdf.hkdf = hkdf;
hkdf.__esModule = true;

module.exports = hkdf;
module.exports.default = hkdf;
module.exports.hkdf = hkdf;
module.exports.__esModule = true;
