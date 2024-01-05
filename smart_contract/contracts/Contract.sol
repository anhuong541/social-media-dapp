// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

// Error codes
uint8 constant ErrUserAlreadyInitialized = 1;
uint8 constant ErrChatNotInitialized = 2;
uint8 constant ErrUserNotInitialized = 3;
uint8 constant ErrPeerNotInitialized = 4;
uint8 constant ErrIncorrectEntryFee = 5;
error BlockchattingError(uint8 code);

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

contract Chat is Ownable {
    /// @dev See `initializeUser` function
    struct UserInitialization {
        bytes encryptedUserSecret;
        bool publicKeyPrefix;
        bytes32 publicKeyX;
    }

    event MessageSent(
        address indexed _from,
        address indexed _to,
        string _message,
        uint256 _time
    );
    event EntryFeeChanged(uint256 amount);
    event UserInitialized(address indexed user);
    event ChatInitialized(address indexed initializer, address indexed peer);

    /// @notice Users must pay this entry fee to start using the application
    uint256 public entryFee = 0.0001 ether;

    /// @notice Mapping of user to their initialization object
    mapping(address => UserInitialization) public userInitializations;

    /// @notice A shared secret between two users, encrypted by the public key of first user
    mapping(address => mapping(address => bytes)) public chatInitializations;

    /// @notice Checks if a user has been initialized
    /// @param user address
    function isUserInitialized(address user) public view returns (bool) {
        return
            !(userInitializations[user].encryptedUserSecret.length == 0 &&
                userInitializations[user].publicKeyX == bytes32(0));
    }

    /// @notice Checks if two users has initialized their chat
    /// @param initializer address
    /// @param peer address
    function isChatInitialized(
        address initializer,
        address peer
    ) public view returns (bool) {
        return
            !(chatInitializations[initializer][peer].length == 0 &&
                chatInitializations[peer][initializer].length == 0);
    }

    /// @notice Emits a MessageEvent, assuming chat is initialized
    /// @param ciphertext A message encrypted by the secret chatting key
    /// @param to recipient address
    function sendMessage(
        string calldata ciphertext,
        address to,
        uint256 time
    ) external {
        if (!isChatInitialized(msg.sender, to)) {
            revert BlockchattingError(ErrChatNotInitialized);
        }
        emit MessageSent(msg.sender, to, ciphertext, time);
    }

    /// @notice Initializes a user, which allows two things:
    /// - user will be able to generate their own key on later logins, by retrieving the encrypted key-gen input and decrypt with their MetaMask
    /// - other users will be able to encrypt messages using this users public key
    /// @param encryptedUserSecret user secret to generate key-pair for the chatting application. it is encrypted by the MetaMask public key
    /// @param publicKeyPrefix prefix of the compressed key stored as a boolean (0x02: true, 0x03: false)
    /// @param publicKeyX 32-byte X-coordinate of the compressed key
    function initializeUser(
        bytes calldata encryptedUserSecret,
        bool publicKeyPrefix,
        bytes32 publicKeyX
    ) external payable {
        if (isUserInitialized(msg.sender)) {
            revert BlockchattingError(ErrUserAlreadyInitialized);
        }
        if (msg.value != entryFee) {
            revert BlockchattingError(ErrIncorrectEntryFee);
        }
        userInitializations[msg.sender] = UserInitialization(
            encryptedUserSecret,
            publicKeyPrefix,
            publicKeyX
        );
        emit UserInitialized(msg.sender);
    }

    /// @notice Initializes a chatting session between two users: msg.sender and a given peer.
    /// A symmetric key is encrypted with both public keys once and stored for each
    /// @dev Both users must be initialized
    /// @param yourEncryptedChatSecret Symmetric key, encrypted by the msg.sender's public key
    /// @param peerEncryptedChatSecret Symmetric key, encrypted by the peer's public key
    /// @param peer address of the peer
    function initializeChat(
        bytes calldata yourEncryptedChatSecret,
        bytes calldata peerEncryptedChatSecret,
        address peer
    ) external {
        if (!isUserInitialized(msg.sender)) {
            revert BlockchattingError(ErrUserNotInitialized);
        }
        if (!isUserInitialized(peer)) {
            revert BlockchattingError(ErrPeerNotInitialized);
        }
        chatInitializations[msg.sender][peer] = yourEncryptedChatSecret;
        chatInitializations[peer][msg.sender] = peerEncryptedChatSecret;
        emit ChatInitialized(msg.sender, peer);
    }

    /// @notice Changes the entry fee
    /// @param _entryFee new entry fee
    function setEntryFee(uint256 _entryFee) external onlyOwner {
        entryFee = _entryFee;
        emit EntryFeeChanged(_entryFee);
    }

    /// @notice Transfers the balance of the contract to the owner
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    receive() external payable {}

    fallback() external payable {}
}
