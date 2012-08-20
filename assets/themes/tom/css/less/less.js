/* less.js
 * detect files change and lessc it
 * 
 * usage:   node less.js [-x] INFILE -d OUTFILE
 * */

var fs = require('fs'),
    walk = require('walk'),
    exec = require('child_process').exec,
    path = require('path');

var lessc = path.resolve('/usr/local/bin/lessc');

var args = process.argv.slice(2);
var infileIndex = args.indexOf('-d') - 1;
console.log(infileIndex);
if(!infileIndex){
    console.log('usage:    node less.js [-x] INFILE -d OUTFILE');
    return;
}
var workdir = path.dirname(args[infileIndex]),
    infile = path.basename(args[infileIndex]);

args = args.join(' ');

var less = function() {
	exec('' + lessc + ' '+ args, {
		encoding: ''
	},
	function(err, stdout, stderr) {
        console.log('' + lessc + ' '+ args);
		if (err) {
			console.log(err);
		} else {
			console.log(infile, 'complied');
		}
	});
};

var detectChange = function(workdir, callback){
    var walker = walk.walk(workdir, {
        followLinks: false
    });

    walker.on('file', function(root, stat, next) {
        if (!/^.\/node_modules/.test(root) && /.less$/.test(stat.name)) { 
            (function(filename) {
                console.log('find', filename);
                var lastWatch = 0;
                fs.watch(filename, {persisitent: false}, function(event, name) {
                    var time = + new Date();
                    if( time - lastWatch > 100 ){
                        if (event === 'change') {
                            callback();
                        }
                        fs.watch(filename, {persisitent: false}, arguments.callee);
                    }
                    lastWatch = time;
                });
            })(root+'/'+stat.name);
        }
        next();
    });
}


less();
detectChange(workdir, less);

