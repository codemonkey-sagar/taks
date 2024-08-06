async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy Voting contract
  const Voting = await ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();
  console.log("Transaction hash for Voting contract deployment:", voting.deployTransaction.hash);
  await voting.deployed();
  console.log("Voting contract deployed to:", voting.address);

  // Deploy DisputeResolution contract
  const DisputeResolution = await ethers.getContractFactory("DisputeResolution");
  const disputeResolution = await DisputeResolution.deploy();
  console.log("Transaction hash for DisputeResolution contract deployment:", disputeResolution.deployTransaction.hash);
  await disputeResolution.deployed();
  console.log("DisputeResolution contract deployed to:", disputeResolution.address);

  // Deploy SimpleReputationSystem contract
  const SimpleReputationSystem = await ethers.getContractFactory("SimpleReputationSystem");
  const reputationSystem = await SimpleReputationSystem.deploy();
  console.log("Transaction hash for SimpleReputationSystem contract deployment:", reputationSystem.deployTransaction.hash);
  await reputationSystem.deployed();
  console.log("SimpleReputationSystem contract deployed to:", reputationSystem.address);

  // Deploy DaoMain contract with all dependencies
  const DaoMain = await ethers.getContractFactory("DaoMain");
  const daoMain = await DaoMain.deploy(disputeResolution.address, voting.address, reputationSystem.address);
  console.log("Transaction hash for DaoMain contract deployment:", daoMain.deployTransaction.hash);
  await daoMain.deployed();
  console.log("DaoMain contract deployed to:", daoMain.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });
