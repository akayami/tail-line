const EventEmitter = require('events');
const fs = require('fs');

module.exports = class SymlinkTracker extends EventEmitter {
	constructor(path, ttl = 100) {
		super();
		this.current = undefined;
		setInterval(() => {
			fs.lstat(path, (err, stat) => {
				if (err) {
					// Ignore errors, keep trying
					//console.error(err);
				} else {
					if (stat.isSymbolicLink()) {
						fs.readlink(path, (err, file) => {
							if (file !== this.current) {
								this.current = file;
								this.emit('change', file);
							}
						})
					} else {
						if (path !== this.current) {
							this.current = path;
							this.emit('change', path);
						}
					}
				}
			})
		}, ttl);
	}
};
