// Run this together with tailer

const base = '/tmp/test/';
const mainFile = 'access.log';
const fs = require('fs');
const path = require('path');
const rs = require('randomstring');


let handle;
let tmpFile;

function rotate(base) {
	// if(handle) {
	// 	fs.renameSync(tmpFile, tmpFile + '.gz');
	// }
	tmpFile = path.join(base, rs.generate() + '.log');
	handle = fs.createWriteStream(tmpFile, { flags: 'a' });
	let symlink = path.join(base, mainFile);
	try {
		fs.unlinkSync(symlink);
	} catch(e) {

	}
	fs.symlinkSync(tmpFile, symlink);
}

setInterval(() => {
	//console.log('Wrote Line');
	handle.write(rs.generate(10) + "\n");
}, 3000)


setInterval(() => {
	console.log('Rotating');
	rotate(base)
}, 30000)

rotate(base);
