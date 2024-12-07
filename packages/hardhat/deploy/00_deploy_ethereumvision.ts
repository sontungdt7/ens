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

  const result = await deploy("EthereumVision", {
    from: deployer,
    // Contract constructor arguments
    args: [
      1000, //royaltyFeeNumerator_      
      40, //minterShares_,
      60, //creatorShares_,
      deployer, //creator_,
      "0xb709D18D0b1f5904CD5Ce0d6dfD11839097f7Cdd", //paymentSplitterReference_,
      "Ethereum Vision", //memory name_,
      "ETHV" //memory symbol_
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
      constructorArguments: [1000, 40, 60, deployer, "0xb709D18D0b1f5904CD5Ce0d6dfD11839097f7Cdd", "Ethereum Vision", "ETHV"],
    });

    console.log("Contract verified successfully!");
  } catch (err) {
    console.error("Verification failed:", err);
  }

  // Get the deployed contract to interact with it after deploying.
  // const yourCollectible = await hre.ethers.getContract<Contract>("EthereumVision", deployer);
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags EthereumVision
deployYourContract.tags = ["EthereumVision"];
