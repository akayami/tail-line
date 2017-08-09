// Run this together with generator

const { Tailer, SymlinkTracker } = require('../index');
const path = '/tmp/test/access.log';

let t = new Tailer(new SymlinkTracker(path));
t.on('line', function(line) {
	console.log(line);
});