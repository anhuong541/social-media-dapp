import * as sjcl from "sjcl";
import EthCrypto, { Encrypted } from "eth-crypto";

export const getPublicKeyByPrivate = (privateAdd: string) => {
  return EthCrypto.publicKeyByPrivateKey(privateAdd);
};

export const encryptMsg = async (publicKey: string, secretMessage: string) => {
  return await EthCrypto.encryptWithPublicKey(publicKey, secretMessage);
};

export const decryptMsg = async (
  privateKey: string,
  encryptedMsg: Encrypted
) => {
  return await EthCrypto.decryptWithPrivateKey(privateKey, encryptedMsg);
};

// Function to encrypt private key with a password
export function encryptPrivateKey(privateKey: string, password: string): any {
  const key = sjcl.misc.pbkdf2(password, "salt", 10000, 256);
  const cipherText = sjcl.encrypt(key, privateKey);

  return cipherText;
}

// Function to decrypt private key with a password
export function decryptPrivateKey(
  cipherText: string,
  password: string
): any | null {
  try {
    const key = sjcl.misc.pbkdf2(password, "salt", 10000, 256);
    const decryptedPrivateKey = sjcl.decrypt(key, cipherText);

    return { message: decryptedPrivateKey, status: "success" };
  } catch (error) {
    console.error("Error decrypting private key. Please check the password.");
    return { message: null, status: "wrong_password_error" };
  }
}
