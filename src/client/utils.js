import crypto from "crypto";

export { hashString };

function hashString(value) {
  const hash = crypto.createHash("sha256");

  hash.update(value);

  return hash.digest("hex");
}
