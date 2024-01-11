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
  try {
    return await EthCrypto.decryptWithPrivateKey(privateKey, encryptedMsg);
  } catch (error) {
    // console.log(error);
    return [];
  }
};

export const alice = {
  address: "0xfD48208363DA96d5ED6E11343a50dD5272762528",
  publicKey:
    "d485fc50cf7da155a5adc4324cfdd6f6414e2367930216b9aa3409c040cb7d1a142c5898a26094c91d030f44cf967815be50a51044dbcfb6b3535c56ba65a6ce",
  privateKey:
    "e0a2dc1e9ec805acae3dd7a9750c910a365badfce51d5cb912dac2e86e88384a",
};

export const johnny = {
  address: "0x01B78D0cE42cF65c487B6683367C7Abc1929bd42",
  publicKey:
    "96692bb9f2845dd064640c75c109b67fb206cf6fcd9df6694eaddedb17f60bc0fc12696635cd867aaae5bb3a23d7d5d84bb40f42a5971421b9aa6ba8b298db7a",
  privateKey:
    "1f89057c503fce2e477787bbf44188e419d1a197912514d8b49cf91d7f638c10",
};
