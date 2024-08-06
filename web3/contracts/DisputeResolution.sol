// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DisputeResolution {
    // Struct to represent a dispute
    struct Dispute {
        address[] jurors; // Array to store juror addresses
        bool resolved;    // Whether the dispute has been resolved
        bool result;      // Result of the dispute
    }

    // Mapping from proposalId to Dispute
    mapping(uint256 => Dispute) public disputes;

    // Function to create a dispute for a proposal
    function createDispute(uint256 proposalId, address[] memory jurors) public {
        // Ensure the dispute doesn't already exist
        require(disputes[proposalId].jurors.length == 0, "Dispute already exists for this proposal.");

        // Store the dispute with the jurors
        disputes[proposalId] = Dispute({
            jurors: jurors,
            resolved: false,
            result: false
        });
    }

    // Function to resolve a dispute
    function resolveDispute(uint256 proposalId, bool _result) public {
        // Ensure the dispute exists and is not yet resolved
        require(disputes[proposalId].jurors.length > 0, "Dispute does not exist.");
        require(!disputes[proposalId].resolved, "Dispute already resolved.");

        // Update the dispute status
        disputes[proposalId].resolved = true;
        disputes[proposalId].result = _result;
    }

    // Function to get the jurors for a specific proposal's dispute
    function getJurors(uint256 proposalId) public view returns (address[] memory) {
        // Ensure the dispute exists
        require(disputes[proposalId].jurors.length > 0, "Dispute does not exist.");

        // Return the list of jurors
        return disputes[proposalId].jurors;
    }

    // Function to get the result of a dispute
    function getDisputeResult(uint256 proposalId) public view returns (bool) {
        // Ensure the dispute exists and is resolved
        require(disputes[proposalId].jurors.length > 0, "Dispute does not exist.");
        require(disputes[proposalId].resolved, "Dispute not yet resolved.");

        // Return the dispute result
        return disputes[proposalId].result;
    }
}
