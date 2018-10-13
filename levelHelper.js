/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);


// Get block from levelDB with given height
function getBlock(height) {
    return new Promise((resolve, reject) => {
        db.get(key, function(err, value) {
            if (err)
                reject(err);
            else
                resolve(JSON.parse(value));
        });
    });
}


// Add block data to levelDB at given height
function addBlock(height, data) {
    return db.put(height, data);
}


// Get height of the blockChain from levelDB
function getBlockHeight() {
    return new Promise((resolve, reject) => {
        let chainHeight = 0;

        db.createKeyStream().on('data', function(data) {
            chainHeight++;
        }).on('error', function(err) {
            console.log('Unable to read key stream!', err);
            reject(err);
        }).on('close', function() {
            resolve(chainHeight);
        });
    });
}


// Get entire blockChain from levelDB
function getBlockChain() {
    return new Promise((resolve, reject) => {
        let chain = [];

        db.createReadStream().on('data', function(data) {
            chain.push(JSON.parse(data.value));
        }).on('error', function(err) {
            console.log('Unable to read data stream!', err);
            reject(err);
        }).on('close', function() {
            resolve(chain);
        });
    });
}


module.exports = {
    getBlock,
    addBlock,
    getBlockHeight,
    getBlockChain,
}
