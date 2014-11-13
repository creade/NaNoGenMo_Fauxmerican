var genball = genball || {};
genball.generators = genball.generators || {};

genball.generators.playGenerator = function(data) {
    var downMoreThanThreeLate = function(quarter, down, distance, at, possession, teams, scoreboard, clock) {
        var possible = [];
        if (quarter < 6) {
            possible = _.select(data[quarter][down], function(play) {
                return play.Dis === distance && play.At === at && !_.contains(["FG", "N"], play.Ty);
            })
        }
        for (var i = 1; i < 6 && possible.length === 0; i++) {
            possible = _.select(data[i][3], function(play) {
                return play.Dis === distance && play.At === at && !_.contains(["FG", "N"], play.Ty);
            })
        }
        if (possible.length === 0) {
            console.log('Down More Than Three Late: "Dn":' + down + ',"Dis":' + distance + ',"At":' + at);

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

    var downThreeOrLessLate = function(quarter, down, distance, at, possession, teams, scoreboard, clock) {
        var possible = [];
        if (quarter < 6) {
            possible = _.select(data[quarter][down], function(play) {
                return play.Dis === distance && play.At === at && !_.contains(["N"], play.Ty);
            })
        }
        for (var i = 1; i < 6 && possible.length === 0; i++) {
            possible = _.select(data[i][3], function(play) {
                return play.Dis === distance && play.At === at && !_.contains(["N"], play.Ty);
            })
        }
        if (possible.length === 0) {
            console.log('Down Less Than Three Late: "Dn":' + down + ',"Dis":' + distance + ',"At":' + at);

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

    var lastPlayKick = function(quarter, down, distance, at, possession, teams, scoreboard, clock) {
        var possible = [];
        if (quarter < 6) {
            possible = _.select(data[quarter][down], function(play) {
                return play.Dn === down && play.Dis === distance && play.At === at && play.Ty === "FG";
            })
        }
        for (var i = 1; i < 6 && possible.length === 0; i++) {
            possible = _.select(data[i][4], function(play) {
                return play.At === at && play.Ty === "FG";
            })
        }
        if (possible.length === 0) {
            console.log('Last Play Kick: "Dn":' + down + ',"Dis":' + distance + ',"At":' + at);

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
    var otMustScoreTouchdown = function(quarter, down, distance, at, possession, teams, scoreboard, clock) {
        var possible = [];
        if (quarter < 6) {
            possible = _.select(data[quarter][down], function(play) {
                return play.Dis === distance && play.At === at && !_.contains(["FG", "N"], play.Ty);
            })
        }
        for (var i = 1; i < 6 && possible.length === 0; i++) {
            possible = _.select(data[i][3], function(play) {
                return play.Dis === distance && play.At === at && !_.contains(["FG", "N"], play.Ty);
            })
        }
        if (possible.length === 0) {
            console.log('OT must score TD: "Dn":' + down + ',"Dis":' + distance + ',"At":' + at);

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

    var normalSituation = function(quarter, down, distance, at, possession, teams, scoreboard, clock) {
        var possible = [];
        var avoid = down < 4 ? ["FG", "N"] : [] 
        if (quarter < 6) {
            possible = _.select(data[quarter][down], function(play) {
                return play.Dis === distance && play.At === at && !_.contains(avoid, play.Ty);
            })
        }
        for (var i = 1; i < 6 && possible.length === 0; i++) {
            possible = _.select(data[i][down], function(play) {
                return play.Dis === distance && play.At === at && !_.contains(avoid, play.Ty);
            })
        }


        if (possible.length === 0) {
            console.log('Normal: "Dn":' + down + ',"Dis":' + distance + ',"At":' + at);

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

        var avoidTypes = [];

        if (quarter === 4 && differential < -3 && at < 60) {
            possible = downMoreThanThreeLate(quarter, down, distance, at, possession, teams, scoreboard, clock);
        } else if (quarter === 4 && differential > -4 && differential <= 0 && clock < 25 && at < 46) {
            possible = lastPlayKick(quarter, down, distance, at, possession, teams, scoreboard, clock)
        } else if (quarter === 4 && differential > -4 && differential < 0 && clock < 180) {
            possible = downThreeOrLessLate(quarter, down, distance, at, possession, teams, scoreboard, clock)
        } else if ((quarter > 4 && differential < -3) || quarter > 6) {
            possible = otMustScoreTouchdown(quarter, down, distance, at, possession, teams, scoreboard, clock)
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
