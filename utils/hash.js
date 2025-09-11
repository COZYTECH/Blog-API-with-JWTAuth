import bcrypt from "bcrypt";
import { createHmac } from "crypto";

const doHash = async (value, saltValue) => {
  const hashedValue = bcrypt.hash(value, saltValue);
  return hashedValue;
};

export default doHash;

export const doHashValidation = async (value, hashedValue) => {
  const result = await bcrypt.compare(value, hashedValue);
  return result;
};
export const hmacProcess = (value, key) => {
  const result = createHmac("sha256", key).update(value).digest("hex");
  return result;
};
