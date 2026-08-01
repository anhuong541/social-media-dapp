const hre = require("hardhat");

async function main() {
  const SocialMedia = await hre.ethers.getContractFactory("SocialMediaV6");
  const socialMedia = await SocialMedia.deploy();
  await socialMedia.waitForDeployment();

  const address = await socialMedia.getAddress();
  console.log("SocialMediaV6 deployed to:", address);
  console.log(
    "Set NEXT_PUBLIC_STATUS_CONTRACT_ADDRESS=" + address + " in ui-client/.env.local"
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
