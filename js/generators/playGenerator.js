var genball = genball || {};
genball.generators = genball.generators || {};

genball.generators.playGenerator = function(data) {

    var meetsStrategy = function(strategy, play, otherTeamStrategy) {
        if (play.St === 1) {
            return false;
        }


        if (play.Ty !== "N") {
            if (strategy === "fg") {
                return (_.isUndefined(play.T) || play.T === 0) && (_.isUndefined(play.FGM) || play.FGM === 1)
            } else if (strategy === "hld") {
                return (_.isUndefined(play.T) || play.T === 0) && (_.isUndefined(play.FGM) || play.FGM === 0)
            } else {
                return (_.isUndefined(play.FGM) || play.FGM === 0)
            }
        } else {
            if (otherTeamStrategy === "fg" || otherTeamStrategy === "hld") {
                return (_.isUndefined(play.T) || play.T === 0)
            } else {
                return true;
            }
        }
    }
    var meetsOTStrategy = function(strategy, play, otherTeamStrategy) {
        if (play.St === 1) {
            return false;
        }


        if (strategy === "fg") {
            return (_.isUndefined(play.T) || play.T === 0) &&
                (_.isUndefined(play.FGM) || play.FGM === 1) &&
                (_.isUndefined(play.I) || play.I === 0) &&
                (_.isUndefined(play.Fl) || play.Fl === 0)
        }

        if (strategy === "hld") {
            return (_.isUndefined(play.T) || play.T === 0) &&
                (_.isUndefined(play.FGM) || play.FGM === 0)
        }

        return (_.isUndefined(play.FGM) || play.FGM === 0) &&
        (_.isUndefined(play.I) || play.I === 0) &&
        (_.isUndefined(play.Fl) || play.Fl === 0)
    }

    var makeKick = function() {
        return [{
            "Dis": 10,
            "At": 23,
            "Ty": "FG",
            "FGM": 1
        }]
    }
    var missKick = function() {
        return [{
            "Dis": 10,
            "At": 23,
            "Ty": "FG",
            "FGM": 0
        }]
    }
    var hailMary = function(at) {
        return [{
            "Dis": at,
            "At": at,
            "Ty": "PA",
            "C": 1,
            "Y": at,
            "T": 1,
            "I": 0
        }, ]
    }
    var firstDown = function(distance) {
        return [
            _.pickRandom(
                [{
                    "Ty": "PA",
                    "C": 1,
                    "Y": distance,
                    "T": 0,
                    "I": 0
                }, {
                    "Ty": "R",
                    "Y": distance,
                    "T": 0,
                    "Sk": 0,
                    "Fu": 0,
                    "Fl": 0,
                    "St": 0
                }])
        ]
    }
    var touchdown = function(distance) {
        return [
            _.pickRandom(
                [{
                    "Ty": "PA",
                    "C": 1,
                    "Y": distance,
                    "T": 1,
                    "I": 0
                }, {
                    "Ty": "R",
                    "Y": distance,
                    "T": 1,
                    "Sk": 0,
                    "Fu": 0,
                    "Fl": 0,
                    "St": 0
                }])
        ]
    }

    var normalSituation = function(quarter, down, distance, at, possession, teams, scoreboard, clock) {
        var possible = [];
        var strategy = possession.getCurrentStrategy();
        var otherTeamStrategy = otherTeam(possession, teams).getCurrentStrategy();
        var avoid = down < 4 ? ["FG", "N"] : ["N"]

        if (quarter < 6) {
            possible = _.select(data[quarter][down], function(play) {
                return play.Dis === distance && play.At === at && !_.contains(avoid, play.Ty) && meetsStrategy(strategy, play, otherTeamStrategy);
            })
        }

        for (var i = 1; i < 6 && possible.length === 0; i++) {
            possible = _.select(data[i][down], function(play) {
                return play.Dis === distance && play.At === at && !_.contains(avoid, play.Ty) && meetsStrategy(strategy, play, otherTeamStrategy);
            })
        }


        if (possible.length === 0) {
            console.log('Normal: "Dn":' + down + ',"Dis":' + distance + ',"At":' + at + ",St:" + strategy);

            possible = [{
                "F": 2,
                "Q": 3,
                "Dn": 2,
                "Dis": 1,
                "At": 9,
                "Ty": "PA",
                "C": 0,
                "Y": 0,
                "T": 0,
                "I": 0
            }];
        }

        return possible;
    }

    var otNormal = function(quarter, down, distance, at, possession, teams, scoreboard, clock) {
        var possible = [];
        var strategy = possession.getCurrentStrategy();
        var otherTeamStrategy = otherTeam(possession, teams).getCurrentStrategy();
        var avoid = down < 4 ? ["FG", "N"] : []

        if (quarter < 6) {
            possible = _.select(data[quarter][down], function(play) {
                return play.Dis === distance && play.At === at && !_.contains(avoid, play.Ty) && meetsOTStrategy(strategy, play, otherTeamStrategy);
            })
        }

        for (var i = 1; i < 6 && possible.length === 0; i++) {
            possible = _.select(data[i][down], function(play) {
                return play.Dis === distance && play.At === at && !_.contains(avoid, play.Ty) && meetsOTStrategy(strategy, play, otherTeamStrategy);
            })
        }


        if (possible.length === 0) {
            console.log('Normal: "Dn":' + down + ',"Dis":' + distance + ',"At":' + at + ",St:" + strategy);

            possible = [{
                "F": 2,
                "Q": 3,
                "Dn": 2,
                "Dis": 1,
                "At": 9,
                "Ty": "PA",
                "C": 0,
                "Y": 0,
                "T": 0,
                "I": 0
            }];
        }

        return possible;
    }

    var makeProgress = function(quarter, down, distance, at, possession, teams, scoreboard, clock) {
        var possible = [];
        var strategy = possession.getCurrentStrategy();
        var otherTeamStrategy = otherTeam(possession, teams).getCurrentStrategy();
        var avoid = down < 4 ? ["FG", "N"] : []

        if (quarter < 6) {
            possible = _.select(data[quarter][down], function(play) {
                return play.Dis === distance && play.At === at && !_.contains(avoid, play.Ty) && meetsStrategy(strategy, play, otherTeamStrategy) && play.Y >= 0 && (_.isUndefined(play.I) || play.I === 0) && (_.isUndefined(play.Fl) || play.Fl === 0);
            })
        }

        for (var i = 1; i < 6 && possible.length === 0; i++) {
            possible = _.select(data[i][down], function(play) {
                return play.Dis === distance && play.At === at && !_.contains(avoid, play.Ty) && meetsStrategy(strategy, play, otherTeamStrategy) && play.Y >= 0 && (_.isUndefined(play.I) || play.I === 0) && (_.isUndefined(play.Fl) || play.Fl === 0);
            })
        }


        if (possible.length === 0) {
            console.log('makeProgress: "Dn":' + down + ',"Dis":' + distance + ',"At":' + at);

            possible = [{
                "Dis": 10,
                "At": Math.floor(at / 2),
                "Ty": "PA",
                "C": 1,
                "Y": Math.floor(at / 2),
                "T": 0,
                "I": 0
            }];
        }

        return possible;
    }


    var otherTeam = function(team, teams) {
        if (team.name === teams.home.name) {
            return teams.away;
        } else {
            return teams.home;
        }
    }

    var nextPlay = function(quarter, down, distance, at, possession, teams, scoreboard, clock) {
        var possible = [];
        var differential = scoreboard.getDifferenital(possession);
        var strategy = possession.getCurrentStrategy();
        var scoresRemaining = possession.scores.length > 0;

        var avoidTypes = [];
        if (down === 4 && at <= 45 && strategy === "fg") {
            possible = makeKick();
        } else if (down === 4 && at <= 45 && strategy === "hld") {
            possible = missKick();
        } else if ((quarter === 4 || quarter === 2) && strategy === "fg" && clock < 25 && at < 46) {
            possible = makeKick();
        } else if ((quarter === 4) && strategy !== "fg" && strategy !== "hld" && clock < 60 * 6) {
            possible = hailMary();
        } else if (quarter >= 2 && quarter < 5 && scoresRemaining) {
            possible = makeProgress(quarter, down, distance, at, possession, teams, scoreboard, clock);
        } else if (quarter > 4 && strategy !== "fg" && strategy !== "hld" && down === 4 && (at - distance) > 0) {
            possible = firstDown(distance);
        } else if (quarter > 4 && strategy !== "fg" && strategy !== "hld" && down === 4 && (at - distance) === 0) {
            possible = touchdown(distance);
        } else if (quarter > 4) {
            possible = otNormal(quarter, down, distance, at, possession, teams, scoreboard, clock);
        } else {
            possible = normalSituation(quarter, down, distance, at, possession, teams, scoreboard, clock);
        }

        var play;

        if (possible.length > 1 && Math.random() > .7) {
            possible = _.sortBy(possible, function(play) {
                if (play.Ty === "N") {
                    return play.Y;
                }
                return play.Y + (play.T * 100);
            });

            var index = Math.max(Math.round((possible.length - 1) * possession.skill - otherTeam(possession, teams).defSkill), 0);

            play = possible[index];
        } else {
            play = _.pickRandom(possible);
        }


        if (play.Ty === "N") {
            return genball.models.punt(play);
        }
        return genball.models.play(play);
        // return genball.models.play({"F":1,"Q":1,"Dn":1,"Dis":5,"At":5,"Ty":"R","Y":-10,"T":0,"Sk":1,"Fu":0,"Fl":0,"St":0});
    }

    return {
        nextPlay: nextPlay
    }
}
