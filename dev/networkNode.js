const bodyParser = require ("body-parser");
const express = require ("express");
const Blockchain = require ("./blockchain");
const uuid = require("uuid/v1");

const app = express();

// process.argv refers to the script run by 'npm start' (check package.json)
const port = process.argv[2];

const bitcoin = new Blockchain();

const nodeAddress = uuid().split("-").join("");

app.use(bodyParser.json()); // parse JSON data from body
app.use(bodyParser.urlencoded({ extended: false })); // parse form data from body


// fetch entire blockchain
app.get("/blockchain", function (req, res) {
    res.send(bitcoin);
});


// create a new transaction
app.post("/transaction", function (req, res) {
    const transaction = req.body;
    const blockIndex = bitcoin.createNewTransaction(transaction.amount, transaction.sender, transaction.recipient);
    res.json({ note: `Transaction will be added in block ${blockIndex}.` });
});

// mines a new block
app.get("/mine", function (req, res) {
    const lastBlock = bitcoin.getLastBlock();
    const previousBlockHash = lastBlock["hash"];
    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock["index"] - 1
    };

    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);

    // reward for who created the block
    bitcoin.createNewTransaction(12.5, "00", nodeAddress);

    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);
    res.json({
        note: "New block mined successfully",
        block: newBlock
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});