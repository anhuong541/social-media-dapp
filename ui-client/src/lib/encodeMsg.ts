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
