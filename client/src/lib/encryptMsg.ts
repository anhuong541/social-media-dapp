import * as crypto from "crypto";

export const demoEncrypt = () => {
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

  console.log("Original Message:", originalMessage);
  console.log("Encrypted Message:", encryptedMessage);

  // Decrypt with private key
  const decryptedMessage = crypto
    .privateDecrypt(
      { key: privateKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING },
      Buffer.from(encryptedMessage, "base64")
    )
    .toString("utf-8");

  console.log("Decrypted Message:", decryptedMessage);
};
