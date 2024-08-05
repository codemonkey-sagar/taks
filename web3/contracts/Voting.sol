// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Proposal {
        string description;
        uint256 approveVotes;
        uint256 disapproveVotes;
        bool resolved;
        bool approved;
    }

    Proposal[] public proposals;
    mapping(address => mapping(uint256 => bool)) public hasVoted;

    function createProposal(string memory description) public {
        proposals.push(
            Proposal({
                description: description,
                approveVotes: 0,
                disapproveVotes: 0,
                resolved: false,
                approved: false
            })
        );
    }

    function vote(uint256 proposalId, bool approve) public {
        require(
            !hasVoted[msg.sender][proposalId],
            "You have already voted on this proposal."
        );
        hasVoted[msg.sender][proposalId] = true;

        Proposal storage proposal = proposals[proposalId];

        if (approve) {
            proposal.approveVotes++;
        } else {
            proposal.disapproveVotes++;
        }
    }

    function approveProposal(uint256 proposalId) public {
        Proposal storage proposal = proposals[proposalId];
        require(!proposal.resolved, "Proposal already resolved.");
        proposal.resolved = true;
        proposal.approved = true;
    }

    function rejectProposal(uint256 proposalId) public {
        Proposal storage proposal = proposals[proposalId];
        require(!proposal.resolved, "Proposal already resolved.");
        proposal.resolved = true;
        proposal.approved = false;
    }

    function getProposal(
        uint256 proposalId
    ) public view returns (string memory, bool) {
        Proposal storage proposal = proposals[proposalId];
        return (proposal.description, proposal.approved);
    }
}
