async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
  
    // Deploy Voting contract
    const Voting = await ethers.getContractFactory("Voting");
    const votingTx = await Voting.deploy();
    console.log("Transaction hash for Voting contract deployment:", votingTx.deployTransaction.hash);
    await votingTx.deployed();
    console.log("Voting contract deployed to:", votingTx.address);
  
    // Deploy DisputeResolution contract
    const DisputeResolution = await ethers.getContractFactory("DisputeResolution");
    const disputeResolutionTx = await DisputeResolution.deploy();
    console.log("Transaction hash for DisputeResolution contract deployment:", disputeResolutionTx.deployTransaction.hash);
    await disputeResolutionTx.deployed();
    console.log("DisputeResolution contract deployed to:", disputeResolutionTx.address);
  
    // Deploy DaoMain contract
    const DaoMain = await ethers.getContractFactory("DaoMain");
    const daoMainTx = await DaoMain.deploy(disputeResolutionTx.address, votingTx.address);
    console.log("Transaction hash for DaoMain contract deployment:", daoMainTx.deployTransaction.hash);
    await daoMainTx.deployed();
    console.log("DaoMain contract deployed to:", daoMainTx.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  