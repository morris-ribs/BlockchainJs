const Blockchain = require ("./blockchain");

const bitcoin = new Blockchain();
bitcoin.createNewBlock(2389, 'HGEIZHOGFKEJGSDESGJ', 'TGJUREZUOIRUEZT');
bitcoin.createNewBlock(111, 'TGJUREZUOIRUEZT', 'RTFHREZUITHRUEIZ');
bitcoin.createNewBlock(2899, 'RTFHREZUITHRUEIZ', 'REZTIOIREZTUITUI');

console.log(bitcoin);