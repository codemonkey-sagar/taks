// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleReputationSystem {
    // Define the Juror struct
    struct Juror {
        uint reputation;
        uint successCount;
        uint failureCount;
        uint totalDisputes;
        bool initialized;
    }

    // Mapping to store juror data by their wallet address
    mapping(address => Juror) public jurors;

    // Events
    event JurorInitialized(address indexed jurorAddress, uint initialReputation);
    event MetricsUpdated(address indexed jurorAddress, uint successCount, uint failureCount, uint totalDisputes, uint newReputation);

    // Function to initialize a new juror with default values
    function initializeJuror(address _jurorAddress) external {
        require(!jurors[_jurorAddress].initialized, "Juror already initialized");

        // Initialize juror data
        jurors[_jurorAddress] = Juror({
            reputation: 4,
            successCount: 0,
            failureCount: 0,
            totalDisputes: 0,
            initialized: true
        });

        emit JurorInitialized(_jurorAddress, 4);
    }

    // Updated function to update a juror's metrics and recalculate reputation
    function updateMetrics(address _jurorAddress, uint _successCount, uint _failureCount) external {
        Juror storage juror = jurors[_jurorAddress];

        require(juror.initialized, "Juror not initialized");

        // Update metrics
        juror.successCount += _successCount;
        juror.failureCount += _failureCount;
        juror.totalDisputes += _successCount + _failureCount;

        // Recalculate reputation
        uint newReputation = calculateReputation(_jurorAddress);

        emit MetricsUpdated(_jurorAddress, juror.successCount, juror.failureCount, juror.totalDisputes, newReputation);
    }

    // Function to calculate reputation based on success rate
    function calculateReputation(address _jurorAddress) internal returns (uint) {
        Juror storage juror = jurors[_jurorAddress];
        uint newReputation;

        if (juror.totalDisputes == 0) {
            newReputation = juror.reputation;
        } else {
            int reputationDelta = int(juror.successCount) - int(juror.failureCount);
            newReputation = uint(max(0, min(100, int(juror.reputation) + reputationDelta)));
        }

        juror.reputation = newReputation;
        return newReputation;
    }

    // Helper function for int bounds
    function max(int a, int b) internal pure returns (int) {
        return a >= b ? a : b;
    }

    function min(int a, int b) internal pure returns (int) {
        return a <= b ? a : b;
    }

    // Function to get a juror's data
    function getJurorData(address _jurorAddress) external view returns (uint reputation, uint successCount, uint failureCount, uint totalDisputes, bool initialized) {
        Juror memory juror = jurors[_jurorAddress];
        return (juror.reputation, juror.successCount, juror.failureCount, juror.totalDisputes, juror.initialized);
    }
}