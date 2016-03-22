var exec = require('child_process').exec;
var gitlog = require('gitlog');

class MultiGitStats {

    constructor() {
        this.commits = [];
        this.paths = [];
        this.onReady = function() {};
        console.log("construct...");
    }

    getGitLogs(path) {

        var options =
            { repo: path
            , number: 10000
            , author: 'Doelia'
            , fields:
              [ 'hash'
              , 'subject'
              , 'authorDate'
              ]
            }

        gitlog(options, function (obj) {
            return function(error, commits) {
                obj.onLogRecv(commits);
            };
        }(this));
    }

    onLogRecv(commits) {
        this.cptRecv++;
        for (var i in commits) {
            var c = commits[i];
            this.commits[i] = c;
        }
        if (this.cptRecv == this.cptLimit) {
            this.onReady();
        }
    }

    buildLogs(f) {
        this.onReady = f;
        this.cptRecv = 0;
        this.cptLimit = this.paths.length;
        for (var i in this.paths) {
            var p = this.paths[i];
            console.log("Run for "+p);
            this.getGitLogs(p);
        }
    }

    recordGitRepo(absolutePath) {
        this.paths.push(absolutePath);
    }


}

var multiGitStats = new MultiGitStats();
multiGitStats.recordGitRepo('/Users/doelia/Documents/dev/learning/dactylo');
multiGitStats.recordGitRepo('/Users/doelia/Documents/dev/learning/multigit-stats');
multiGitStats.buildLogs(function() {
    console.log(this.commits);
});
setTimeout(function() {}, 2000);
