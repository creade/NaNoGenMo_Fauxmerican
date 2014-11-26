$(document).ready(function() {
    $.when(
        $.getJSON("js/data/team_data.json"),
        $.getJSON("js/data/first_names.json"),
        $.getJSON("js/data/last_names.json"),
        $.getJSON("js/data/play_by_q_and_dn.json"),
        $.getJSON("js/data/kickdata.json"),
        $.getJSON("img/logos.json")
    ).done(function(teamData, firstNames, lastNames, playData, kickdata, logos) {
        var lastNameGenerator = genball.generators.lastNameGenerator(lastNames);
        var firstNameGenerator = genball.generators.firstNameGenerator(firstNames);
        var finalScoreGenerator = genball.generators.finalScoreGenerator();
        var institutionGenerator = genball.generators.institutionGenerator(teamData[0].places);
        var teamGenerator = genball.generators.teamGenerator(teamData, firstNameGenerator, lastNameGenerator, institutionGenerator, logos);

        var finalScores = finalScoreGenerator.next();
        var homeTeam = teamGenerator.newTeam(finalScores.home);
        var awayTeam = teamGenerator.newTeam(finalScores.away);

        var playsToParas = function(plays) {
            var drivesInQ = _.groupBy(plays, 'driveNumber');

            var playsByDrive = Object.keys(drivesInQ).map(function(key) {
                return drivesInQ[key];
            });

            return _.map(playsByDrive, function(plays) {
                return {
                    text: _.reduce(plays, function(memo, play) {
                        return memo + play.commentary;
                    }, ""),
                    data: {}
                }
            });

        }

        var seed = Math.random().toString(36).substring(7);
        console.log(seed)
        Math.seedrandom(seed);
        var foundTie = false;

        var viewModel = {
            pages: [
                genball.pages.openingPage(institutionGenerator, homeTeam, awayTeam)
            ],
            currentPage: ko.observable(0),
            nextPage: function() {
                if (this.currentPage() >= 4) {
                    this.pages.push({
                        paras: playsToParas(this.game.playUntilNext())
                    });
                }
                this.currentPage(this.currentPage() + 1);
            },
            game: null
        }

        while (!foundTie) {


            var gameGenerator = genball.generators.gameGenerator();

            viewModel.game = gameGenerator.next(playData[0], kickdata[0], homeTeam, awayTeam, homeTeam.stadium, false)
            var q1 = viewModel.game.playUntilNext();
            var q2 = viewModel.game.playUntilNext();
            var q3 = viewModel.game.playUntilNext();
            var q4 = viewModel.game.playUntilNext();

            if (viewModel.game.scoreboard.awayScores.total - viewModel.game.scoreboard.homeScores.total === 0) {
                foundTie = true;
                viewModel.pages.push({
                    paras: playsToParas(q1)
                });
                viewModel.pages.push({
                    paras: playsToParas(q2)
                });
                viewModel.pages.push({
                    paras: playsToParas(q3)
                });
                viewModel.pages.push({
                    paras: playsToParas(q4)
                });
            }
        };

        ko.applyBindings(viewModel);

    })
})
