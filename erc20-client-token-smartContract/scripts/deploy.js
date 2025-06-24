// const hre = require("hardhat");

// async function main() {
//   const [deployer] = await hre.ethers.getSigners();

//   console.log("Deploying contracts with account:", deployer.address);

//   const Token = await hre.ethers.getContractFactory("RegisteredERC20");
//   const token = await Token.deploy(deployer.address); // Pass initial owner

//   await token.waitForDeployment(); // ✅ Replace .deployed() with .waitForDeployment()

//   console.log("Contract deployed to:", await token.getAddress());
// }

// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });


const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contract with account:", deployer.address);

  const Token = await hre.ethers.getContractFactory("NTTToken");
  const token = await Token.deploy(deployer.address); // pass admin address

  await token.waitForDeployment();

  console.log("Contract deployed to:", await token.getAddress());
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
