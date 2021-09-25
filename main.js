const SHA256 = require('crypto-js/sha256');

class Block {
	constructor(index, timestamp, data, prevHash = '') {
		this.index = index;
		this.timestamp = timestamp;
		this.data = data;
		this.prevHash = prevHash;
		this.hash = this.calculateHash();
		this.nonce = 0;
	}

	calculateHash() {
		return SHA256(
			this.index + this.prevHash + this.timestamp + this.nonce + JSON.stringify(this.data)
		).toString();
	}

	mineBlock(difficulty) {
		while (this.hash.substr(0, difficulty) !== Array(difficulty + 1).join('0')) {
			this.nonce++;
			this.hash = this.calculateHash();
		}

		console.log('Block mined: ' + this.hash);
	}
}

class BlockChain {
	constructor() {
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 5;
	}

	createGenesisBlock() {
		return new Block(0, Date.now(), 'genisis block', null);
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}

	addBlock(newBlock) {
		newBlock.prevHash = this.chain[this.chain.length - 1].hash;
		newBlock.mineBlock(this.difficulty);
		this.chain.push(newBlock);
	}

	isChainValid() {
		for (let i = 1; i < this.chain.length; i++) {
			const current = this.chain[i];
			const prev = this.chain[i - 1];

			if (current.calculateHash() !== current.hash) {
				return false;
			}
			if (current.prevHash !== prev.hash) {
				return false;
			}
		}
		return true;
	}
}

const georgeCoin = new BlockChain();

console.log('Mining block 1...');
georgeCoin.addBlock(new Block(1, Date.now(), { amount: 4 }));

console.log('Mining block 2...');
georgeCoin.addBlock(new Block(2, Date.now(), { amount: 999 }));
