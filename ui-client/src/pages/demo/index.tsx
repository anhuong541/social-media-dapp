import { decryptPrivateKey, encryptPrivateKey } from "@/lib/enCodePrivateKey";
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
      console.error(`Error fetching address information: ${error}`);
    }
  }

  async function hendle() {
    try {
      // create identitiy with key-pairs and address
      const michal = {
        address: "0x1F853748A54D0d144D4ABF848BA81a019EF93543",
        publicKey:
          "0b1bb90c9d154fbcda2c5542e5a1ffaae370c7ec2d2e840595a4b170629c23287e76fce91beb1485fedec0fa24dd1c28f026b0bd6384ef6c4387659d737a0722",
        privateKey:
          "b20e2d801ffcc5cfb768a39bf2cc10671ca15b5c4ab2d374b067313afd0bcd16",
      };

      const alice = {
        address: "0xAd2a2F9132d475963453641a3680833c4A1Cd523",
        publicKey:
          "d92fb664cd5390e5c0b314eabb88c8af06c43e156822fe20d29c8dab001c6a2290f3097f475e02b4b6237a70267eb87638785b1cfec00c53e90daffd0d1ac605",
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
        console.log({ alice, michal });
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Example usage
  const privateKey =
    "b20e2d801ffcc5cfb768a39bf2cc10671ca15b5c4ab2d374b067313afd0bcd16";
  const password = "0911342127mn";

  const wrongPassword = "thisiswroog";

  const onEncryptKey = () => {
    const encryptedPrivateKey = encryptPrivateKey(privateKey, password);

    if (encryptedPrivateKey !== null) {
      console.log("Encrypted Private Key:", encryptedPrivateKey);

      const decryptedPrivateKey = decryptPrivateKey(
        encryptedPrivateKey,
        wrongPassword
      );

      if (decryptedPrivateKey !== null) {
        console.log("Decrypted Private Key:", decryptedPrivateKey);
      }
    }
  };

  return (
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

      <button
        onClick={onEncryptKey}
        className="py-1 px-3 rounded-lg bg-yellow-800"
      >
        This is demo encrypt private address
      </button>
    </div>
  );
}
