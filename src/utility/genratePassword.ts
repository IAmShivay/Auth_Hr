import crypto from "crypto";

export const generatePassword = (): string => {
    return crypto.randomBytes(8).toString("hex"); // Generates a 16-character alphanumeric password
  };