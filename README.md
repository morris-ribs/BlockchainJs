# BlockchainJs

This is a simple Node JS development of a blockchain.

It contains:
- a back-end implementation of adding nodes to a blockchain, mining blocks and broadcasting transactions
- an HTML/AngularJS page with a Block Explorer

# First: clone and install the dependencies

Be sure to install Node in your machine. Then, clone or fork this repository and run `npm i` to install all the dependencies. 

# Second: start the nodes

Open five terminals, and in each one of then launch a different terminal:

 - run `npm run node_1` to launch node number 1 at localhost:3001
 - run `npm run node_2` to launch node number 2 at localhost:3002
 - run `npm run node_3` to launch node number 3 at localhost:3003
 - run `npm run node_4` to launch node number 4 at localhost:3004 
 - run `npm run node_5` to launch node number 5 at localhost:3005
 
 # Third: register and broadcast nodes
 
 Open Postman and do a POST to localhost:3001/register-and-broadcast-node with the following request body
 
 `{ "newNodeUrl": "http://localhost:PORT" }`
 
 where PORT is the port of the node (3002 to 3005)
 
 After this three steps, you will be able to create and broadcast transactions, as well as mine blocks.
 
 ## Important functions
 
 ### See blockchain
 
 `GET /blockchain`
 
 Example: open an API client and do a GET request to http://localhost:3001/blockchain
 
 ### Create and broadcast transactions
  
 `POST /transaction/broadcast`
 
 Example: open an API client and do a POST request to http://localhost:3002/transaction/broadcast with a request body such as:
 
 `
 { 
  "amount": 120, 
  "sender": "DRFTSGDGDFGDFG", 
  "recipient": "AZODAZIODJOIAZDJ" 
}
 `
 This should add the transaction to the pending transactions collection and broadcast this information to all nodes in the network.
 
 ### Mine blocks
 
 `GET /mine`
 
 Example: open an API client and do a GET request to http://localhost:3001/mine
 
 Then check the blockchain in all of the nodes.
 
### Consensus

 `GET /consensus`

If there are nodes with different chains, we can reach a consensus calling this endpoint in one of them. For example: http://localhost:3005/consensus
