$(document).ready(function() {
    $.when(
        $.getJSON("js/data/team_data.json"),
        $.getJSON("js/data/first_names.json"),
        $.getJSON("js/data/last_names.json"),
        $.getJSON("js/data/play_by_q_and_dn.json"),
        $.getJSON("js/data/kickdata.json"),
        $.getJSON("img/logos.json")
    ).done(function(teamData, firstNames, lastNames, playData, kickdata, logos) {
        var seed = Math.random().toString(36).substring(7);
        console.log(seed)
        Math.seedrandom(seed);

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

        var foundTie = false;

        var viewModel = {
            pages: [
                genball.pages.openingPage(institutionGenerator, homeTeam, awayTeam)
            ],
            currentPage: ko.observable(0),
            nextPage: function() {
                if (this.currentPage() >= 4) {
                    var playedOT = this.game.playUntilNext();
                    this.pages.push({
                        paras: playsToParas(playedOT.playsForNow)
                    });
                    this.home(playedOT.home);
                    this.away(playedOT.away);
                }
                this.currentPage(this.currentPage() + 1);
                $("html, body").animate({ scrollTop: 0 }, "slow");
            },
            game: null,
            home: ko.observable(homeTeam),
            away: ko.observable(awayTeam),
            logo: function(logo, size, klass) {
                if (klass) {
                    return '<svg class="' + klass + '" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '">' + logo + "</svg>"
                }
                return '<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '">' + logo + "</svg>"
            },
            getPassingPlayers: function(team) {
                return _.chain(team.players)
                    .select(function(player) {
                        var stats = player.stats;
                        return !!stats && stats["PA"];
                    })
                    .map(function(player) {
                        var dataStats = player.stats;
                        return {
                            player: player,
                            team: team.shortName,
                            points: ((dataStats["PTD"] || 0) * 4) + ((dataStats["PY"] || 0) * .04)
                        };
                    })
                    .sortBy("points")
                    .reverse()
                    .value();
            },
            getRushingPlayers: function(team) {
                return _.chain(team.players)
                    .select(function(player) {
                        var stats = player.stats;
                        return !!stats && stats["RA"];
                    })
                    .map(function(player) {
                        var dataStats = player.stats;
                        return {
                            player: player,
                            team: team.shortName,
                            points: ((dataStats["RTDS"] || 0) * 4) + ((dataStats["RYDS"] || 0) * .04)
                        }
                    })
                    .sortBy("points")
                    .reverse()
                    .value();
            },
            getReceivingPlayers: function(team) {
                return _.chain(team.players)
                    .select(function(player) {
                        var stats = player.stats;
                        return !!stats && stats["R"];
                    })
                    .map(function(player) {
                        var dataStats = player.stats;
                        return {
                            player: player,
                            team: team.shortName,
                            points: ((dataStats["RECTD"] || 0) * 4) + (dataStats["R"] || 0) + ((dataStats["RECY"] || 0) * .04)
                        }
                    })
                    .sortBy("points")
                    .reverse()
                    .value();
            },

            getKickingPlayers: function(team) {
                return _.chain(team.players)
                    .select(function(player) {
                        var stats = player.stats;
                        return !!stats && (stats["XPA"] || stats["FGA"]);
                    })
                    .map(function(player) {
                        return {
                            player: player
                        }
                    })
                    .value();
            },
            getDefensivePlayers: function(team) {
                return _.chain(team.players)
                    .select(function(player) {
                        var stats = player.stats;
                        return !!stats && (stats["FR"] || stats["INTD"] || stats["SK"]);
                    })
                    .map(function(player) {
                        return {
                            player: player
                        }
                    })
                    .value();
            },

            getReturnPlayers: function(team) {
                return _.select(team.players, function(player) {
                    var stats = player.stats;
                    return !!stats && (stats["PR"] || stats["KOR"]);
                });
            },
            getPuntingPlayers: function(team) {
                return _.chain(team.players)
                    .select(function(player) {
                        var stats = player.stats;
                        return !!stats && stats["P"];
                    })
                    .map(function(player) {
                        return {
                            player: player
                        }
                    })
                    .value();
            }
        }

        while (!foundTie) {


            var gameGenerator = genball.generators.gameGenerator();

            viewModel.game = gameGenerator.next(playData[0], kickdata[0], homeTeam, awayTeam, homeTeam.stadium, false)
            var q1 = viewModel.game.playUntilNext().playsForNow;
            var q2 = viewModel.game.playUntilNext().playsForNow;
            var q3 = viewModel.game.playUntilNext().playsForNow;
            var q4 = viewModel.game.playUntilNext().playsForNow;

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
