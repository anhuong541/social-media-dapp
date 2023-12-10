require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    rinkeby: {
      url: "https://eth-mainnet.g.alchemy.com/v2/D921hqvIgrLTtV4g9ucUew5V4LQ_hYHo",
      accounts: [
        "66ddcea898d9ac261eac727fdda2bc024d47db54e66685c0db81471822b6ee3c",
      ],
    },
  },
};

// metamark
// 66ddcea898d9ac261eac727fdda2bc024d47db54e66685c0db81471822b6ee3c
// phantom
// 0xeed5c6bcd953416cf76e0730dfb2e9d0b6caf948eda4d4cdfb70212b47c0012c

// url: https://eth-mainnet.g.alchemy.com/v2/D921hqvIgrLTtV4g9ucUew5V4LQ_hYHo
