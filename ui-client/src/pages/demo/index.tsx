import { decryptMsg, encryptMsg, getPublicKeyByPrivate } from "@/lib/encodeMsg";
import axios from "axios";

export default function DemoPage() {
  // Example usage
  const ethereumAddress = "0xAd2a2F9132d475963453641a3680833c4A1Cd523";
  const etherscanApiKey = "1AP33JR172Z5EJT7SY6F28289GIIR8I2HJ"; // Replace with your Etherscan API key

  async function getAddressInfo(
    address: string,
    apiKey: string
  ): Promise<void> {
    try {
      const apiUrl = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&apikey=${apiKey}`;

      const response = await axios.get(apiUrl);

      if (response.data.status === "1") {
        const balance = response.data.result;
        // console.log(`Balance for address ${address}: ${response.data}`);
        console.log({ result: response.data });
      } else {
        console.error(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error(`Error fetching address information: ${error.message}`);
    }
  }

  async function hendle() {
    try {
      // create identitiy with key-pairs and address
      const alice = {
        // address: "0xAd2a2F9132d475963453641a3680833c4A1Cd523",
        // "d92fb664cd5390e5c0b314eabb88c8af06c43e156822fe20d29c8dab001c6a2290f3097f475e02b4b6237a70267eb87638785b1cfec00c53e90daffd0d1ac605"
        publicKey: getPublicKeyByPrivate(
          "66ddcea898d9ac261eac727fdda2bc024d47db54e66685c0db81471822b6ee3c"
        ),
        privateKey:
          "66ddcea898d9ac261eac727fdda2bc024d47db54e66685c0db81471822b6ee3c",
      };

      // const alice = EthCrypto.createIdentity();

      const secretMessage = "My name is Satoshi Buterin";
      const encrypted = await encryptMsg(
        alice.publicKey, // encrypt with alice's publicKey
        secretMessage
      );

      const decrypted = await decryptMsg(alice.privateKey, encrypted);

      if (decrypted === secretMessage) {
        console.log("success");
        console.log({ alice });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="">
        <button className="py-1 px-3 rounded-lg bg-green-400" onClick={hendle}>
          This is the demo click
        </button>

        <button
          className="py-1 px-3 rounded-lg bg-purple-400"
          onClick={() => getAddressInfo(ethereumAddress, etherscanApiKey)}
        >
          This is the demo call publickey
        </button>
      </div>
    </>
  );
}
