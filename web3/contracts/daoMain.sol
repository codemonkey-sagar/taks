// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./DisputeResolution.sol";
import "./Voting.sol";
import "./SimpleReputationSystem.sol"; // Import the Reputation System contract

contract DaoMain {
    address public owner;
    DisputeResolution public disputeResolution;
    Voting public voting;
    SimpleReputationSystem public reputationSystem; // Add a variable for the reputation system

    constructor(address _disputeResolution, address _voting, address _reputationSystem) {
        owner = msg.sender;
        disputeResolution = DisputeResolution(_disputeResolution);
        voting = Voting(_voting);
        reputationSystem = SimpleReputationSystem(_reputationSystem); // Initialize the reputation system
    }

    function createProposal(string memory description) public {
        require(msg.sender == owner, "Only owner can create proposals.");
        voting.createProposal(description);
    }

    function voteOnProposal(uint256 proposalId, bool approve) public {
        voting.vote(proposalId, approve);
    }

    function resolveDispute(uint256 proposalId) public {
        // Get the dispute result
        bool result = disputeResolution.getDisputeResult(proposalId);

        // Get juror addresses involved in the dispute
        address[] memory jurors = disputeResolution.getJurors(proposalId);

        // Update the reputation of jurors based on the result
        for (uint256 i = 0; i < jurors.length; i++) {
            // Retrieve the juror's data as a tuple
            (uint reputation, uint successCount, uint totalDisputes, bool initialized) = reputationSystem.jurors(jurors[i]);

            // Check if juror has been initialized
            if (!initialized) {
                reputationSystem.initializeJuror(jurors[i]);
            }

            if (result) {
                // Increment success count and total disputes
                reputationSystem.updateMetrics(
                    jurors[i],
                    successCount + 1,
                    totalDisputes + 1
                );
            } else {
                // Only increment total disputes
                reputationSystem.updateMetrics(
                    jurors[i],
                    successCount,
                    totalDisputes + 1
                );
            }
        }

        // Update proposal status based on dispute resolution
        if (result) {
            voting.approveProposal(proposalId);
        } else {
            voting.rejectProposal(proposalId);
        }
    }
}
