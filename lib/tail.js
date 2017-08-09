const SymlinkTracker = require('./tracker');
const readline = require('readline');
const fst = require('fs-tail-stream');
const EventEmitter = require('events');


module.exports = class Tracker extends EventEmitter {
	constructor(symlinkTracker, ttl = 1000) {
		super();
		this.ttl = ttl;
		this.scanning = false;
		this.eof = false;
		this.tail = undefined;
		this.stack = [];
		this.tracker = symlinkTracker;
		this.tracker.on('change', (f) => {
			console.log('New File detected');
			this.stack.push(f);
			this.scan()
		});
	}

	scan() {
		if (!this.scanning || this.eof) {
			if(this.eof) {
				this.tail.close();
				this.tail = undefined;
				this.scanning = false;
			}
			let file = this.stack.shift();
			this.scanning = true;
			this.tail = readline.createInterface({
				input: fst.createReadStream(file, {
					tail: true
				})
			});
			this.tail.on('line', (line) => {
				this.emit('line', line);

				if (this.tail.__timeout) {
					clearTimeout(this.tail.__timeout);
				}

				this.tail.__timeout = setTimeout(() => {
					this.eof = true;
					if (this.stack.length > 0) {
						console.log('New file present, assuming done, switching');
						this.scan()
					} else {
						this.eof = true;
					}
				}, this.ttl)
			});
		}
	}
}