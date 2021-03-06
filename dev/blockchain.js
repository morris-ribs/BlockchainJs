const sha256 = require("sha256");
const uuid = require("uuid/v1");
const currentNodeUrl = process.argv[3];

function Blockchain() {
  this.chain = [];
  this.pendingTransactions = [];
  this.currentNodeUrl = currentNodeUrl;
  this.networkNodes = []; // all nodes in the network
  
  // creating genesis block
   this.createNewBlock(100, "0", "0");
}

Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
  const newBlock = {
    index: this.chain.length + 1,
    timestamp: Date.now(),
    transactions: this.pendingTransactions,
    nonce: nonce,
    hash: hash,
    previousBlockHash: previousBlockHash
  };

  this.pendingTransactions = [];
  this.chain.push(newBlock);

  return newBlock;
};


Blockchain.prototype.getLastBlock = function() {
  return this.chain[this.chain.length - 1];
};

Blockchain.prototype.createNewTransaction = function (amount, sender, recipient) {
  const newTransaction = {
    amount: amount,
    sender: sender,
    recipient: recipient,
    transactionId: uuid().split("-").join("")
  };

  return newTransaction;
};

Blockchain.prototype.addTransactionToPendingTransactions = function (transactionObj) {
  this.pendingTransactions.push(transactionObj);
  return this.getLastBlock()["index"] + 1;
};

Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
  const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
  const hash = sha256(dataAsString);
  return hash;
};

Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
  let nonce = 0;
  let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
  
  // repeatedly hashes a block until it finds correct hash (starting with four zeros) => '0000XXXXXXXX' 
  // uses both current and previous block hash  
  while (hash.substring(0,4) !== "0000") {
    // continuously changes nonce value until it finds the correct hash
    hash = this.hashBlock(previousBlockHash, currentBlockData, ++nonce);
  }
  
  // returns the nonce value that creates the correct hash
  return nonce;
};

Blockchain.prototype.chainIsValid = function(blockchain) {
  for (var i = 1; i < blockchain.length; i++) {
    const currentBlock = blockchain[i];
    const prevBlock = blockchain[i - 1];
    const blockHash = this.hashBlock(prevBlock["hash"], { transactions: (currentBlock["transactions"] || []), index: prevBlock["index"] - 1 }, currentBlock["nonce"]);

    if (blockHash.substring(0, 4) !== "0000") {
      return false;
    }

    if (currentBlock["previousBlockHash"] !== prevBlock["hash"]) {
      return false;
    }
  }

  const genesisBlock = blockchain[0];
  const correctNonce = genesisBlock["nonce"] === 100;
  const correctPreviousBlockHash = genesisBlock["previousBlockHash"] === "0";
  const correctHash = genesisBlock["hash"] === "0";
  const correctTransactions = genesisBlock["transactions"].length === 0;

  if (!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions) {
    return false;
  }

  return true;
};

Blockchain.prototype.getBlock = function(blockHash) {
  let correctBlock = null;
  this.chain.forEach(block => {
    if (block.hash === blockHash) {
      correctBlock = block;
      return;
    }
  });

  return correctBlock;
};

Blockchain.prototype.getTransaction = function(transactionId) {
  let correctBlock = null;
  let correctTransaction = null;
  this.chain.forEach(block => {
    block.transactions.forEach(transaction => {
      if (transaction.transactionId === transactionId) {
        correctTransaction =  transaction;
        correctBlock = block;
        return;
      }
    });
  });

  return {
    transaction: correctTransaction,
    block: correctBlock
  };
};

// gets all the transactions and balance for an address
Blockchain.prototype.getAddressData = function(address) {
  const addressTransactions = [];
  this.chain.forEach(block => {
    block.transactions.forEach(transaction => {
      if (transaction.sender === address || transaction.recipient === address) {
        addressTransactions.push(transaction);
      }
    });
  });

  let balance = 0;
  addressTransactions.forEach(transaction => {
    if (transaction.recipient === address) {
      balance += transaction.amount;
    } else if (transaction.sender === address) {
      balance -= transaction.amount;
    }
  });

  return {
    addressTransactions: addressTransactions,
    addressBalance: balance
  };
};

module.exports = Blockchain;