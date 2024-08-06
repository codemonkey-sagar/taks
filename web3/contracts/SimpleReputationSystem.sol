// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleReputationSystem {
    // Define the Juror struct
    struct Juror {
        uint reputation;      // Reputation score
        uint successCount;    // Number of successful disputes handled
        uint totalDisputes;   // Total number of disputes handled
        bool initialized;     // Flag to check if the juror is initialized
    }

    // Mapping to store juror data by their wallet address
    mapping(address => Juror) public jurors;

    // Events
    event JurorInitialized(address indexed jurorAddress, uint initialReputation);
    event MetricsUpdated(address indexed jurorAddress, uint successCount, uint totalDisputes, uint newReputation);

    // Constructor
    constructor() {}

    // Function to initialize a new juror with default values
    function initializeJuror(address _jurorAddress) external {
        require(!jurors[_jurorAddress].initialized, "Juror already initialized");

        // Initialize juror data
        jurors[_jurorAddress] = Juror({
            reputation: 4,        // Start with 0 reputation
            successCount: 0,      // Start with 0 successful disputes
            totalDisputes: 0,     // Start with 0 total disputes
            initialized: true    // Mark as initialized
        });

        emit JurorInitialized(_jurorAddress, 4);
    }

    // Function to update a juror's metrics and calculate new reputation
    function updateMetrics(address _jurorAddress, uint _successCount, uint _totalDisputes) external {
        Juror storage juror = jurors[_jurorAddress];
        
        require(juror.initialized, "Juror not initialized");

        // Update juror's metrics
        juror.successCount = _successCount;
        juror.totalDisputes = _totalDisputes;

        // Calculate reputation based on success rate
        uint newReputation = calculateReputation(_jurorAddress);
        juror.reputation = newReputation;

        emit MetricsUpdated(_jurorAddress, _successCount, _totalDisputes, newReputation);
    }

    // Function to calculate reputation based on success rate
    function calculateReputation(address _jurorAddress) public view returns (uint) {
        Juror memory juror = jurors[_jurorAddress];

        // Handle cases where totalDisputes is 0 to avoid division by zero
        if (juror.totalDisputes == 0) {
            return 0; // Return 0 reputation if no disputes
        }

        // Calculate success rate as a percentage
        uint successRate = (juror.successCount * 100) / juror.totalDisputes;

        // Reputation is equal to the success rate
        return successRate;
    }

    // Function to get a juror's data
    function getJurorData(address _jurorAddress) external view returns (Juror memory) {
        return jurors[_jurorAddress];
    }
}
