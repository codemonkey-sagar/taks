// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./DisputeResolution.sol";
import "./Voting.sol";

contract DaoMain {
    address public owner;
    DisputeResolution public disputeResolution;
    Voting public voting;

    constructor(address _disputeResolution, address _voting) {
        owner = msg.sender;
        disputeResolution = DisputeResolution(_disputeResolution);
        voting = Voting(_voting);
    }

    function createProposal(string memory description) public {
        require(msg.sender == owner, "Only owner can create proposals.");
        voting.createProposal(description);
    }

    function voteOnProposal(uint256 proposalId, bool approve) public {
        voting.vote(proposalId, approve);
    }

    function resolveDispute(uint256 proposalId) public {
        bool result = disputeResolution.getDisputeResult(proposalId);
        if (result) {
            voting.approveProposal(proposalId);
        } else {
            voting.rejectProposal(proposalId);
        }
    }
}
