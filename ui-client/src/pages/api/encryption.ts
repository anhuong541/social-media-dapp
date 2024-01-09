// pages/api/encryption.ts

import { NextApiRequest, NextApiResponse } from "next";
import * as crypto from "crypto";

const handlerEncryptMsg = (req: NextApiRequest, res: NextApiResponse) => {
  // Generate key pair
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });

  // Original message
  const originalMessage = "Hello, World!";

  // Encrypt with public key
  const encryptedMessage = crypto
    .publicEncrypt(
      { key: publicKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING },
      Buffer.from(originalMessage, "utf-8")
    )
    .toString("base64");

  // Decrypt with private key
  const decryptedMessage = crypto
    .privateDecrypt(
      { key: privateKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING },
      Buffer.from(encryptedMessage, "base64")
    )
    .toString("utf-8");

  // Respond with the results
  res.status(200).json({
    originalMessage,
    encryptedMessage,
    decryptedMessage,
  });
};

export default handlerEncryptMsg;
