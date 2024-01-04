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

contract TipContract {
    address public owner;

    mapping(address => uint256) public totalTips; // Track total tips for each address

    event Tipped(address indexed from, address indexed to, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function tip(address to, uint256 amount) external payable {
        require(amount > 0, "Amount must be greater than 0");
        require(msg.value >= amount, "Insufficient funds sent with the tip");

        (bool success, ) = to.call{value: amount}("");
        require(success, "Failed to send tip");

        totalTips[to] += amount; // Update total tips for the recipient address

        emit Tipped(msg.sender, to, amount);
    }

    function getTotalTipAmount(
        address account
    ) external view returns (uint256) {
        return totalTips[account];
    }

    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}

contract SocialMediaUpdate {
    uint256 constant MAX_CHARACTER_AMOUNT = 140;

    mapping(address => string) public statuses;
    mapping(address => uint256) public tipAmounts;

    event StatusUpdated(
        address indexed user,
        string newStatus,
        uint256 timestamp
    );

    event TipReceived(
        address indexed from,
        address indexed to,
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

    function tip(address to, uint256 amount) external payable {
        require(amount > 0, "Amount must be greater than 0");
        require(msg.value >= amount, "Insufficient funds sent with the tip");

        (bool success, ) = to.call{value: amount}("");
        require(success, "Failed to send tip");

        tipAmounts[to] += amount; // Update total tips for the recipient address

        emit TipReceived(msg.sender, to, amount, block.timestamp);
    }

    function getTipAmount(address _user) public view returns (uint256) {
        return tipAmounts[_user];
    }

    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}

// contract with like button
contract SocialMediaV2 {
    uint256 constant MAX_CHARACTER_AMOUNT = 140;

    mapping(address => uint256) public lastStatusId;
    mapping(address => mapping(uint256 => string)) public statuses;
    mapping(uint256 => string[]) public comments; // Comments associated with a statusId
    mapping(address => mapping(uint256 => uint256)) public likes; // Number of likes for each status
    mapping(address => uint256) public tipAmounts;

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

    event TipReceived(
        address indexed from,
        address indexed to,
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

    function addComment(uint256 _statusId, string memory _comment) public {
        require(
            bytes(_comment).length <= MAX_CHARACTER_AMOUNT,
            "Comment is too long"
        );

        comments[_statusId].push(_comment);

        emit CommentAdded(msg.sender, _statusId, _comment, block.timestamp);
    }

    function addLike(uint256 _statusId) public payable {
        require(msg.value > 0, "Amount must be greater than 0");

        // Increase the likes count for the status
        likes[msg.sender][_statusId]++;

        // Emit LikeAdded event
        emit LikeAdded(
            msg.sender,
            _statusId,
            likes[msg.sender][_statusId],
            block.timestamp
        );

        // Transfer the funds to the contract owner
        payable(owner).transfer(msg.value);

        emit TipReceived(msg.sender, owner, msg.value, block.timestamp);
    }

    function getLikes(uint256 _statusId) public view returns (uint256) {
        // Retrieve likes count from the calling user's address
        return likes[msg.sender][_statusId];
    }

    function getStatus(
        address _user,
        uint256 _statusId
    ) public view returns (string memory) {
        string memory status = statuses[_user][_statusId];
        if (bytes(status).length == 0) {
            return "No status set";
        } else {
            return status;
        }
    }

    function getLatestStatus(
        address _user
    ) public view returns (string memory) {
        uint256 latestStatusId = lastStatusId[_user];
        return getStatus(_user, latestStatusId);
    }

    function getComments(
        uint256 _statusId
    ) public view returns (string[] memory) {
        // Retrieve comments from the specific statusId
        return comments[_statusId];
    }

    function tip(address to, uint256 amount) external payable {
        require(amount > 0, "Amount must be greater than 0");
        require(msg.value >= amount, "Insufficient funds sent with the tip");

        (bool success, ) = to.call{value: amount}("");
        require(success, "Failed to send tip");

        tipAmounts[to] += amount; // Update total tips for the recipient address

        emit TipReceived(msg.sender, to, amount, block.timestamp);
    }

    function getTipAmount(address _user) public view returns (uint256) {
        return tipAmounts[_user];
    }

    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}

contract SocialMediaV3 {
    uint256 constant MAX_CHARACTER_AMOUNT = 140;

    mapping(address => uint256) public lastStatusId;
    mapping(address => mapping(uint256 => string)) public statuses;
    mapping(uint256 => string[]) public comments; // Comments associated with a statusId
    mapping(address => mapping(uint256 => uint256)) public likes; // Number of likes for each status
    mapping(address => uint256) public tipAmounts;

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

    event TipReceived(
        address indexed from,
        address indexed to,
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

    function addComment(uint256 _statusId, string memory _comment) public {
        require(
            bytes(_comment).length <= MAX_CHARACTER_AMOUNT,
            "Comment is too long"
        );

        comments[_statusId].push(_comment);

        emit CommentAdded(msg.sender, _statusId, _comment, block.timestamp);
    }

    function addLike(uint256 _statusId) public payable {
        require(msg.value > 0, "Amount must be greater than 0");

        // Increase the likes count for the status
        likes[msg.sender][_statusId]++;

        // Emit LikeAdded event
        emit LikeAdded(
            msg.sender,
            _statusId,
            likes[msg.sender][_statusId],
            block.timestamp
        );

        // Transfer the funds to the contract owner
        payable(owner).transfer(msg.value);

        emit TipReceived(msg.sender, owner, msg.value, block.timestamp);
    }

    function getLikes(uint256 _statusId) public view returns (uint256) {
        // Retrieve likes count from the calling user's address
        return likes[msg.sender][_statusId];
    }

    function getComments(
        uint256 _statusId
    ) public view returns (string[] memory) {
        // Retrieve comments from the specific statusId
        return comments[_statusId];
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
                comments[_statusId].length
            );
        }
    }

    function editStatus(uint256 _statusId, string memory _newStatus) public {
        require(
            bytes(_newStatus).length <= MAX_CHARACTER_AMOUNT,
            "New status is too long"
        );
        require(_statusId <= lastStatusId[msg.sender], "Invalid status ID");

        statuses[msg.sender][_statusId] = _newStatus;

        emit StatusUpdated(msg.sender, _statusId, _newStatus, block.timestamp);
    }

    function deleteStatus(uint256 _statusId) public {
        require(_statusId <= lastStatusId[msg.sender], "Invalid status ID");

        // Delete the status
        delete statuses[msg.sender][_statusId];

        // Emit an event to indicate the status deletion
        emit StatusUpdated(msg.sender, _statusId, "", block.timestamp);
    }

    function getLatestStatus(
        address _user
    ) public view returns (string memory, uint256, uint256) {
        uint256 latestStatusId = lastStatusId[_user];
        return getStatus(_user, latestStatusId);
    }

    function tip(address to, uint256 amount) external payable {
        require(amount > 0, "Amount must be greater than 0");
        require(msg.value >= amount, "Insufficient funds sent with the tip");

        (bool success, ) = to.call{value: amount}("");
        require(success, "Failed to send tip");

        tipAmounts[to] += amount; // Update total tips for the recipient address

        emit TipReceived(msg.sender, to, amount, block.timestamp);
    }

    function getTipAmount(address _user) public view returns (uint256) {
        return tipAmounts[_user];
    }

    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}
