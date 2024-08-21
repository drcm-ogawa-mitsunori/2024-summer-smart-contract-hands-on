import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

task("withdraw", "Withdraw from Lock.").setAction(async (_, hre) => {
  const signers = await hre.ethers.getSigners();
  const defaultSigner = signers[0];

  const beforeBalance = await defaultSigner.provider.getBalance(defaultSigner.address);
  console.log('beforeBalance', beforeBalance);

  const lockContractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
  const lock = await hre.ethers.getContractAt("Lock", lockContractAddress);
  await lock.withdraw();

  const afterBalance = await defaultSigner.provider.getBalance(defaultSigner.address);
  console.log('afterBalance', afterBalance);
  console.log('afterBalance - beforeBalance', afterBalance - beforeBalance);
});

const config: HardhatUserConfig = {
  solidity: "0.8.24",
};

export default config;
