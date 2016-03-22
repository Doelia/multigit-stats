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
              , 'committerDate'
              ]
            }

        gitlog(options, function (obj) {
            return function(error, commits) {
                obj.onLogRecv(commits, path);
            };
        }(this));
    }

    onLogRecv(commits, path) {
        this.cptRecv++;
        for (var i in commits) {
            var c = commits[i];
            c.repo = path;
            this.commits.push(c);
        }
        if (this.cptRecv == this.cptLimit) {
            console.log('ready');
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

class LogAnalyser {

    constructor(listCommits) {
        this.commits = listCommits;
    }

    show() {
        for (var i in this.commits) {
            var c = this.commits[i];
            //console.log(c);
            var d = new Date(c.authorDate);
            console.log(d);
        }
    }

    showProjects(commits) {
        for (var i in commits) {
            var c = commits[i];
            console.log(c.authorDate+" - "+c.repo);
        }
    }

    getCommitsOnDate(day, month, year) {
        var commits = [];
        var min = new Date(year, month, day);
        console.log('Searched date : '+min);
        var max = new Date(min);
        max.setDate(max.getDate() + 1);

        for (var i in this.commits) {
            var c = this.commits[i];
            var d = new Date(c.authorDate);
            if (d < max && d > min) {
                commits.push(c);
            }
        }

        return commits;
    }


}

var multiGitStats = new MultiGitStats();
multiGitStats.recordGitRepo('/Users/doelia/Documents/dev/learning/dactylo');
multiGitStats.recordGitRepo('/Users/doelia/Documents/dev/learning/multigit-stats');
multiGitStats.buildLogs(function() {
    var logAnalyser = new LogAnalyser(this.commits);
    //logAnalyser.show();
    var commits = logAnalyser.getCommitsOnDate(22, 2, 2016);
    logAnalyser.showProjects(commits);
});
setTimeout(function() {}, 2000);
