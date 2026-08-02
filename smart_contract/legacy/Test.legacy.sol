// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract SocialMediaV7 {
    uint256 constant MAX_CHARACTER_AMOUNT = 140;

    mapping(address => uint256) public lastStatusId;
    mapping(address => mapping(uint256 => string)) public statuses;
    mapping(address => mapping(uint256 => string[])) public hashtags; // New mapping for hashtags
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

    event HashtagAdded(
        address indexed user,
        uint256 indexed statusId,
        string hashtag,
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

    function setStatus(
        string memory _status,
        string[] memory _hashtags
    ) public {
        require(
            bytes(_status).length <= MAX_CHARACTER_AMOUNT,
            "Status is too long"
        );

        uint256 statusId = lastStatusId[msg.sender] + 1;
        lastStatusId[msg.sender] = statusId;

        statuses[msg.sender][statusId] = _status;

        // Add hashtags to the status
        for (uint256 i = 0; i < _hashtags.length; i++) {
            hashtags[msg.sender][statusId].push(_hashtags[i]);
            emit HashtagAdded(
                msg.sender,
                statusId,
                _hashtags[i],
                block.timestamp
            );
        }

        emit StatusUpdated(msg.sender, statusId, _status, block.timestamp);
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

    function getHashtags(
        address _user,
        uint256 _statusId
    ) public view returns (string[] memory) {
        // Retrieve hashtags for a specific statusId and user address
        return hashtags[_user][_statusId];
    }

    function filterStatusByHashtag(
        address _user,
        string memory _hashtag
    ) public view returns (uint256[] memory) {
        uint256 lastId = lastStatusId[_user];
        uint256[] memory matchingStatusIds = new uint256[](lastId);

        uint256 count = 0;
        for (uint256 i = 1; i <= lastId; i++) {
            string[] memory statusHashtags = hashtags[_user][i];
            for (uint256 j = 0; j < statusHashtags.length; j++) {
                if (
                    keccak256(abi.encodePacked(statusHashtags[j])) ==
                    keccak256(abi.encodePacked(_hashtag))
                ) {
                    matchingStatusIds[count] = i;
                    count++;
                    break; // Found the hashtag in this status, move to the next status
                }
            }
        }

        // Resize the array to remove any unused slots
        assembly {
            mstore(matchingStatusIds, count)
        }

        return matchingStatusIds;
    }

    function editStatus(
        address _user,
        uint256 _statusId,
        string memory _newStatus
    ) public {
        require(
            bytes(_newStatus).length <= MAX_CHARACTER_AMOUNT,
            "New status is too long"
        );
        require(_statusId <= lastStatusId[_user], "Invalid status ID");

        statuses[_user][_statusId] = _newStatus;

        emit StatusUpdated(_user, _statusId, _newStatus, block.timestamp);
    }

    function deleteStatus(address _user, uint256 _statusId) public {
        require(_statusId <= lastStatusId[_user], "Invalid status ID");

        // Delete the status
        delete statuses[_user][_statusId];

        // Emit an event to indicate the status deletion
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
        require(msg.value > 0, "Tip amount must be greater than 0");
        require(
            payable(_user).balance >= msg.value,
            "Recipient has insufficient balance for the tip"
        );

        // Increase the tip amount for the receiver
        tips[_user][msg.sender] += msg.value;

        // Increase the total tips received by the user
        totalTipsReceived[_user] += msg.value;

        // Transfer the tip amount to the user
        (bool success, ) = payable(_user).call{value: msg.value}("");
        require(success, "Tip transfer to recipient failed");

        // Emit TipSent event
        emit TipSent(msg.sender, _user, msg.value, block.timestamp);
    }

    function getTotalTipsReceived(address _user) public view returns (uint256) {
        // Retrieve the total tip count for a specific user
        return totalTipsReceived[_user];
    }
}

contract ChatNewUpdated is Ownable {
    struct ChatRequest {
        bool exists;
        bool accepted;
        bytes32 securityKey;
    }

    struct ChatMessageInfo {
        address user1;
        address user2;
        uint256 timestamp;
        string message;
    }

    mapping(address => mapping(address => ChatRequest)) public chatRequests;
    mapping(address => mapping(address => ChatMessageInfo[]))
        public chatMessages;

    event ChatRequestSent(address indexed sender, address indexed receiver);
    event ChatRequestAccepted(address indexed sender, address indexed receiver);
    event MessageSent(
        address indexed sender,
        address indexed receiver,
        string message
    );

    function sendChatRequest(address receiver) external {
        require(
            !chatRequests[msg.sender][receiver].exists,
            "Chat request already sent"
        );
        require(
            !chatRequests[receiver][msg.sender].exists,
            "Chat request already received"
        );

        chatRequests[msg.sender][receiver] = ChatRequest(
            true,
            false,
            bytes32(0)
        );
        emit ChatRequestSent(msg.sender, receiver);
    }

    function acceptChatRequest(address sender) external {
        require(
            chatRequests[sender][msg.sender].exists,
            "No chat request from this user"
        );
        require(
            !chatRequests[sender][msg.sender].accepted,
            "Chat request already accepted"
        );

        chatRequests[sender][msg.sender].accepted = true;
        chatRequests[sender][msg.sender].securityKey = keccak256(
            abi.encodePacked(msg.sender, sender, block.timestamp)
        );

        emit ChatRequestAccepted(sender, msg.sender);
    }

    function sendMessage(address receiver, string calldata message) external {
        require(
            chatRequests[msg.sender][receiver].exists ||
                chatRequests[receiver][msg.sender].exists,
            "No active chat with this user"
        );
        require(
            chatRequests[msg.sender][receiver].accepted ||
                chatRequests[receiver][msg.sender].accepted,
            "Chat request not accepted"
        );

        ChatMessageInfo memory messageInfo;

        messageInfo = ChatMessageInfo({
            user1: msg.sender,
            user2: receiver,
            timestamp: block.timestamp,
            message: message
        });

        chatMessages[messageInfo.user1][messageInfo.user2].push(messageInfo);

        emit MessageSent(msg.sender, receiver, message);
    }

    function getAllChatMessagesWithInfo(
        address user1,
        address user2
    ) external view returns (ChatMessageInfo[] memory messagesInfo) {
        uint256 numSenderMessages = chatMessages[user1][user2].length;
        uint256 numReceiverMessages = chatMessages[user2][user1].length;

        uint256 totalMessages = numSenderMessages + numReceiverMessages;

        messagesInfo = new ChatMessageInfo[](totalMessages);

        // Populate array with sender's messages
        for (uint256 i = 0; i < numSenderMessages; i++) {
            messagesInfo[i] = chatMessages[user1][user2][i];
        }

        // Populate array with receiver's messages
        for (uint256 i = 0; i < numReceiverMessages; i++) {
            uint256 index = numSenderMessages + i;
            messagesInfo[index] = chatMessages[user2][user1][i];
        }

        return messagesInfo;
    }

    function getChatMessages(
        address sender,
        address receiver
    ) external view returns (ChatMessageInfo[] memory) {
        ChatMessageInfo[] storage senderMessages = chatMessages[sender][
            receiver
        ];
        ChatMessageInfo[] storage receiverMessages = chatMessages[receiver][
            sender
        ];

        uint256 totalMessages = senderMessages.length + receiverMessages.length;
        ChatMessageInfo[] memory messages = new ChatMessageInfo[](
            totalMessages
        );

        // Copy sender's messages
        for (uint256 i = 0; i < senderMessages.length; i++) {
            messages[i] = senderMessages[i];
        }

        // Copy receiver's messages
        for (uint256 i = 0; i < receiverMessages.length; i++) {
            messages[senderMessages.length + i] = receiverMessages[i];
        }

        return messages;
    }

    function hasPendingChatRequest(
        address sender
    ) external view returns (bool) {
        return
            chatRequests[sender][msg.sender].exists &&
            !chatRequests[sender][msg.sender].accepted;
    }
}

contract ImageNFT is ERC721, Ownable {
    uint256 public nextTokenId;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        nextTokenId = 1;
    }

    function mint() external onlyOwner {
        uint256 tokenId = nextTokenId;
        _safeMint(msg.sender, tokenId);
        nextTokenId++;
    }

    function mintTo(address to) external onlyOwner {
        uint256 tokenId = nextTokenId;
        _safeMint(to, tokenId);
        nextTokenId++;
    }
}
