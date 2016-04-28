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
            console.log(c.authorDate+" - "+c.repo+" - "+c.subject);
        }
    }

    getCommitsOnDate(min, max) {
        console.log('Searched date : '+min+' and '+max);

        var commits = [];

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
multiGitStats.recordGitRepo('/Users/doelia/Documents/dev/psol/v2/predict');
multiGitStats.recordGitRepo('/Users/doelia/Documents/dev/psol/axa');
multiGitStats.recordGitRepo('/Users/doelia/Documents/dev/psol/groupama');
multiGitStats.recordGitRepo('/Users/doelia/Documents/dev/psol/v3/m-common');
multiGitStats.recordGitRepo('/Users/doelia/Documents/dev/psol/v3/m-niveaux');
multiGitStats.recordGitRepo('/Users/doelia/Documents/dev/psol/v3/m-users');
multiGitStats.recordGitRepo('/Users/doelia/Documents/dev/psol/v3/m-hydrometeo');
multiGitStats.recordGitRepo('/Users/doelia/Documents/dev/psol/v3/m-carto');
multiGitStats.recordGitRepo('/Users/doelia/Documents/dev/psol/v3/m-previ');
multiGitStats.recordGitRepo('/Users/doelia/Documents/dev/psol/v3/m-lames');
multiGitStats.recordGitRepo('/Users/doelia/Documents/dev/psol/v3/m-geoloc');
multiGitStats.recordGitRepo('/Users/doelia/Documents/dev/psol/v3/i-admin');
multiGitStats.recordGitRepo('/Users/doelia/Documents/dev/psol/naski/naski');

multiGitStats.buildLogs(function() {
    var logAnalyser = new LogAnalyser(this.commits);
    var commits = logAnalyser.getCommitsOnDate(new Date('2016-04-17'), new Date('2016-04-23'));
    logAnalyser.showProjects(commits);
});

setTimeout(function() {}, 2000);
