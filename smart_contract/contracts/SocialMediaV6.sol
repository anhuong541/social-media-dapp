// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

/**
 * On-chain social feed used by ui-client (wagmi ABI: statusContract.ts).
 * Posts, likes, comments, and tips live on Polygon.
 */
contract SocialMediaV6 {
    uint256 constant MAX_CHARACTER_AMOUNT = 140;

    mapping(address => uint256) public lastStatusId;
    mapping(address => mapping(uint256 => string)) public statuses;
    mapping(uint256 => mapping(address => string[])) public comments;
    mapping(address => mapping(uint256 => uint256)) public likes;
    mapping(address => mapping(address => uint256)) public tips;
    mapping(address => uint256) public totalTipsReceived;

    event StatusUpdated(
        address indexed user,
        uint256 indexed statusId,
        string newStatus,
        uint256 timestamp
    );

    event CommentAdded(
        address indexed user,
        uint256 indexed statusId,
        string comment,
        uint256 timestamp
    );

    event LikeAdded(
        address indexed user,
        uint256 indexed statusId,
        uint256 likesCount,
        uint256 timestamp
    );

    event TipSent(
        address indexed sender,
        address indexed receiver,
        uint256 amount,
        uint256 timestamp
    );

    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function setStatus(string memory _status) public {
        require(
            bytes(_status).length <= MAX_CHARACTER_AMOUNT,
            "Status is too long"
        );

        uint256 statusId = lastStatusId[msg.sender] + 1;
        lastStatusId[msg.sender] = statusId;

        statuses[msg.sender][statusId] = _status;

        emit StatusUpdated(msg.sender, statusId, _status, block.timestamp);
    }

    function addComment(
        address _user,
        uint256 _statusId,
        string memory _comment
    ) public {
        require(
            bytes(_comment).length <= MAX_CHARACTER_AMOUNT,
            "Comment is too long"
        );
        require(_statusId <= lastStatusId[_user], "Invalid status ID");

        comments[_statusId][_user].push(_comment);

        emit CommentAdded(msg.sender, _statusId, _comment, block.timestamp);
    }

    function addLike(address _user, uint256 _statusId) public {
        require(_statusId <= lastStatusId[_user], "Invalid status ID");
        likes[_user][_statusId]++;
        emit LikeAdded(
            _user,
            _statusId,
            likes[_user][_statusId],
            block.timestamp
        );
    }

    function getLikes(
        address _user,
        uint256 _statusId
    ) public view returns (uint256) {
        return likes[_user][_statusId];
    }

    function getComments(
        uint256 _statusId,
        address _user
    ) public view returns (string[] memory) {
        return comments[_statusId][_user];
    }

    function getStatus(
        address _user,
        uint256 _statusId
    ) public view returns (string memory, uint256, uint256) {
        string memory status = statuses[_user][_statusId];
        if (bytes(status).length == 0) {
            return ("No status set", 0, 0);
        } else {
            return (
                status,
                likes[_user][_statusId],
                comments[_statusId][_user].length
            );
        }
    }

    function editStatus(
        address _user,
        uint256 _statusId,
        string memory _newStatus
    ) public {
        require(msg.sender == _user, "Only status owner can edit");
        require(
            bytes(_newStatus).length <= MAX_CHARACTER_AMOUNT,
            "New status is too long"
        );
        require(_statusId <= lastStatusId[_user], "Invalid status ID");

        statuses[_user][_statusId] = _newStatus;

        emit StatusUpdated(_user, _statusId, _newStatus, block.timestamp);
    }

    function deleteStatus(address _user, uint256 _statusId) public {
        require(msg.sender == _user, "Only status owner can delete");
        require(_statusId <= lastStatusId[_user], "Invalid status ID");

        delete statuses[_user][_statusId];

        emit StatusUpdated(
            _user,
            _statusId,
            "deleted_status_@",
            block.timestamp
        );
    }

    function getLatestStatus(
        address _user
    ) public view returns (string memory, uint256, uint256) {
        uint256 latestStatusId = lastStatusId[_user];
        return getStatus(_user, latestStatusId);
    }

    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    function tipUser(address _user) public payable {
        require(_user != address(0), "Invalid recipient");
        require(_user != msg.sender, "Cannot tip yourself");
        require(msg.value > 0, "Tip amount must be greater than 0");

        tips[_user][msg.sender] += msg.value;
        totalTipsReceived[_user] += msg.value;

        (bool success, ) = payable(_user).call{value: msg.value}("");
        require(success, "Tip transfer to recipient failed");

        emit TipSent(msg.sender, _user, msg.value, block.timestamp);
    }

    function getTotalTipsReceived(address _user) public view returns (uint256) {
        return totalTipsReceived[_user];
    }
}
