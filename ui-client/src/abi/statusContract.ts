/** Minimal ABI for SocialMediaV6 (status feed / tip / comments). */
export const statusContractAbi = [
  {
    type: "function",
    name: "setStatus",
    stateMutability: "nonpayable",
    inputs: [{ name: "_status", type: "string" }],
    outputs: [],
  },
  {
    type: "function",
    name: "addComment",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_user", type: "address" },
      { name: "_statusId", type: "uint256" },
      { name: "_comment", type: "string" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "addLike",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_user", type: "address" },
      { name: "_statusId", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "getComments",
    stateMutability: "view",
    inputs: [
      { name: "_statusId", type: "uint256" },
      { name: "_user", type: "address" },
    ],
    outputs: [{ name: "", type: "string[]" }],
  },
  {
    type: "function",
    name: "getStatus",
    stateMutability: "view",
    inputs: [
      { name: "_user", type: "address" },
      { name: "_statusId", type: "uint256" },
    ],
    outputs: [
      { name: "", type: "string" },
      { name: "", type: "uint256" },
      { name: "", type: "uint256" },
    ],
  },
  {
    type: "function",
    name: "editStatus",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_user", type: "address" },
      { name: "_statusId", type: "uint256" },
      { name: "_newStatus", type: "string" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "deleteStatus",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_user", type: "address" },
      { name: "_statusId", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "tipUser",
    stateMutability: "payable",
    inputs: [{ name: "_user", type: "address" }],
    outputs: [],
  },
  {
    type: "function",
    name: "getTotalTipsReceived",
    stateMutability: "view",
    inputs: [{ name: "_user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "event",
    name: "StatusUpdated",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "statusId", type: "uint256", indexed: true },
      { name: "newStatus", type: "string", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
] as const;
