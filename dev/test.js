const Blockchain = require ("./blockchain");

const bitcoin = new Blockchain();

/*bitcoin.createNewBlock(892348, 'A2REZGTREZTRET34546354', 'RTYREYEY435GEYG');

bitcoin.createNewTransaction(100, 'MAURE8RT4REZT89REST', 'JENNRTGQ7E89RHUTRSGH');


bitcoin.createNewBlock(123123, 'RTYREYEY435GEYG', 'HRYHRRT456RGER');

bitcoin.createNewTransaction(50, 'MAURE8RT4REZT89REST', 'JENNRTGQ7E89RHUTRSGH');
bitcoin.createNewTransaction(300, 'MAURE8RT4REZT89REST', 'JENNRTGQ7E89RHUTRSGH');
bitcoin.createNewTransaction(2000, 'MAURE8RT4REZT89REST', 'JENNRTGQ7E89RHUTRSGH');

bitcoin.createNewBlock(123123, 'HRYHRRT456RGER', 'EZNJORTJZORTIJREZO');*/

const previousBlockHash = "OINAISDFN09N09ASDNF90N90ASNDF";
const currentBlockData = [
    {
        amount: 50, sender: 'MAURE8RT4REZT89REST', recipient: 'JENNRTGQ7E89RHUTRSGH'
    }, {
        amount: 300, sender: 'BOBJJYEJTYHDGHDHD', recipient: 'JENNRTGQ7E89RHUTRSGH'
    }, {
        amount: 2000, sender: 'TOMRPOTKIROYJDORTYHJORT', recipient: 'JENNRTGQ7E89RHUTRSGH'
    }
];

console.log(bitcoin);

//console.log(bitcoin.proofOfWork(previousBlockHash, currentBlockData));
// verifying the result of the POW
//console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, 46685));