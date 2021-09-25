const SHA256 = require('crypto-js/sha256');

class Transaction {
	constructor(fromAdress, toAddress, amount) {
		// this = {...this, fromAdress, toAddress, amount}
		this.fromAdress = fromAdress;
		this.toAddress = toAddress;
		this.amount = amount;
	}
}

class Block {
	constructor(timestamp, transactions, prevHash = '') {
		this.timestamp = timestamp;
		this.transactions = transactions;
		this.prevHash = prevHash;
		this.hash = this.calculateHash();
		this.nonce = 0;
	}

	calculateHash() {
		return SHA256(
			this.index +
				this.prevHash +
				this.timestamp +
				this.nonce +
				JSON.stringify(this.transactions)
		).toString();
	}

	mineBlock(difficulty) {
		while (this.hash.substr(0, difficulty) !== Array(difficulty + 1).join('0')) {
			this.nonce++;
			this.hash = this.calculateHash();
		}
	}
}

class BlockChain {
	constructor() {
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 5;
		this.pendingTransactions = [];
		this.miningReward = 100;
	}

	createGenesisBlock() {
		return new Block(Date.now(), 'genisis block', null);
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}

	minePendingTransactions(miningRewardAddress) {
		console.log('Mining block #' + this.chain.length);
		const newBlock = new Block(Date.now(), this.pendingTransactions);
		newBlock.mineBlock(this.difficulty);
		this.chain.push(newBlock);
		console.log('Block mined: ' + newBlock.hash);

		this.pendingTransactions = [new Transaction(null, miningRewardAddress, this.miningReward)];
	}

	createTransaction(transaction) {
		this.pendingTransactions.push(transaction);
	}

	getAddressBalance(address) {
		let balance = 0;
		for (const [index, block] of this.chain.entries()) {
			if (index === 0) continue;

			for (const transaction of block.transactions) {
				if (transaction.fromAdress === address) {
					balance -= transaction.amount;
				}
				if (transaction.toAddress === address) {
					balance += transaction.amount;
				}
			}
		}

		return balance;
	}

	// NOTE: This is the old method
	// addBlock(newBlock) {
	// 	newBlock.prevHash = this.chain[this.chain.length - 1].hash;
	// 	newBlock.mineBlock(this.difficulty);
	// 	this.chain.push(newBlock);
	// }

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

georgeCoin.createTransaction(new Transaction(null, 'address1', 1000));
georgeCoin.createTransaction(new Transaction('address1', 'address2', 100));
georgeCoin.createTransaction(new Transaction('address1', 'address3', 150));
georgeCoin.createTransaction(new Transaction('address4', 'address1', 200));
georgeCoin.createTransaction(new Transaction('address2', 'address3', 20));

georgeCoin.minePendingTransactions('addressM1');
console.log({
	miner1: georgeCoin.getAddressBalance('addressM1'),
	address1: georgeCoin.getAddressBalance('address1')
});

georgeCoin.createTransaction(new Transaction('address1', 'address4', 250));
georgeCoin.createTransaction(new Transaction('address4', 'address2', 5));

georgeCoin.minePendingTransactions('addressM2');
console.log({
	miner1: georgeCoin.getAddressBalance('addressM1'),
	address1: georgeCoin.getAddressBalance('address1')
});
