const bodyParser = require ("body-parser");
const express = require ("express");
const uuid = require("uuid/v1");
const rp = require("request-promise");

const Blockchain = require ("./blockchain");

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

// register and broadcast node
app.post("/register-and-broadcast-node", function (req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1) {
        bitcoin.networkNodes.push(newNodeUrl);
    }
    
    const regNodesPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + "/register-node",
            method: "POST",
            body: { newNodeUrl: newNodeUrl },
            json: true
        };
        regNodesPromises.push(rp(requestOptions));
    });

    Promise.all(regNodesPromises)
    .then(data => {
        const bulkRegisterOptions = {
            uri: newNodeUrl + "/register-nodes-bulk",
            method: "POST",
            body: { allNetworkNodes: [ ...bitcoin.networkNodes, bitcoin.currentNodeUrl ] },
            json: true
        };

        return rp(bulkRegisterOptions);
    })
    .then(data => {
        res.json({ note: "New node registered with network successfully." });
    });
});

// register a single node
app.post("/register-node", function (req, res) {
    
});

// register multiple nodes at once
app.post("/register-nodes-bulk", function (req, res) {
    
});

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});