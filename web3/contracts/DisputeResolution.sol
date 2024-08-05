// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DisputeResolution {
    struct Dispute {
        mapping(address => bool) hasVoted;
        uint256 approveVotes;
        uint256 disapproveVotes;
        uint256 totalJurors;
        bool disputeResolved;
        bool proposalApproved;
    }

    mapping(uint256 => Dispute) public disputes;
    uint256 public disputeCount;

    constructor() {}

    function startDispute(uint256 proposalId, uint256 totalJurors) public {
        disputeCount++;
        disputes[proposalId].totalJurors = totalJurors;
    }

    function vote(uint256 proposalId, bool approve) public {
        Dispute storage dispute = disputes[proposalId];
        require(!dispute.hasVoted[msg.sender], "You have already voted.");
        dispute.hasVoted[msg.sender] = true;

        if (approve) {
            dispute.approveVotes++;
        } else {
            dispute.disapproveVotes++;
        }

        if (
            dispute.approveVotes + dispute.disapproveVotes ==
            dispute.totalJurors
        ) {
            dispute.disputeResolved = true;
            dispute.proposalApproved =
                dispute.approveVotes > dispute.disapproveVotes;
        }
    }

    function getDisputeResult(uint256 proposalId) public view returns (bool) {
        require(
            disputes[proposalId].disputeResolved,
            "Dispute not yet resolved."
        );
        return disputes[proposalId].proposalApproved;
    }
}
