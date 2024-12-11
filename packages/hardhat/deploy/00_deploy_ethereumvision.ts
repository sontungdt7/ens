import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const result = await deploy("EthereumNorthStar", {
    from: deployer,
    // Contract constructor arguments
    args: [
      750, //royaltyFeeNumerator_      
      50, //minterShares_,
      50, //creatorShares_,
      deployer, //creator_,
      "0x13B8c8716d614aCC9E255044B4b6cDdCdA62e780", //paymentSplitterReference_,
      "Ethereum North Star", //memory name_,
      "ENS" //memory symbol_
    ],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  console.log("Verifying contract...");

  try {
    await hre.run("verify:verify", {
      address: result.address,
      constructorArguments: [750, 50, 50, deployer, "0x13B8c8716d614aCC9E255044B4b6cDdCdA62e780", "Ethereum North Star", "ENS"],
    });

    console.log("Contract verified successfully!");
  } catch (err) {
    console.error("Verification failed:", err);
  }
  
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags EthereumNorthStar
deployYourContract.tags = ["EthereumNorthStar"];