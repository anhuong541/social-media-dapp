// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract SocialMedia {
    uint256 constant MAX_CHARACTER_AMOUNT = 140;
    mapping(address => string) public statuses;
    event StatusUpdated(
        address indexed user,
        string newStatus,
        uint256 timestamp
    );

    function setStatus(string memory _status) public {
        require(
            bytes(_status).length <= MAX_CHARACTER_AMOUNT,
            "Status is so long"
        );
        statuses[msg.sender] = _status;
        emit StatusUpdated(msg.sender, _status, block.timestamp);
    }

    function getStatus(address _user) public view returns (string memory) {
        string memory status = statuses[_user];
        if (bytes(status).length == 0) {
            return "No status set";
        } else {
            return status;
        }
    }
}
