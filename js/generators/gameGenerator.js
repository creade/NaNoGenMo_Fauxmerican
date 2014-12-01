var genball = genball || {};
genball.generators = genball.generators || {};



genball.generators.gameGenerator = function() {
    var next = function(data, kickdata, home, away, stadium, debugOn) {
        var playGenerator = genball.generators.playGenerator(data);
        var kickoffGenerator = genball.generators.kickoffGenerator(kickdata);

        var scoreboard = genball.models.scoreboard(home, away);
        var commentaryGenerator = genball.generators.commentaryGenerator();
        var driveSummaries = [];


        var teams = {
            home: home,
            away: away
        };

        var completed = false;
        var winner;

        teams[away.name] = away;
        teams[home.name] = home;


        var firstToKick = _.pickRandom([away.name, home.name]);
        var driveState = genball.models.driveState().newDriveState(firstToKick);

        var plays = [];

        var setupStats = function(team) {
            team.stats = {};
            _.each(team.players, function(player) {
                player.stats = {};
            });
        }

        var hasOTs = 0;



        setupStats(home);

        setupStats(away);

        var changePossession = function(driveState) {
            if (driveState.possession === home.name) {
                driveState.possession = away.name;
            } else {
                driveState.possession = home.name
            }
            driveState.down = 1;
            driveState.at = 100 - driveState.at;
            driveState.distance = Math.min(10, driveState.at);
            driveState.driveNumber++;
            driveSummaries[driveState.driveNumber] = {
                "start": driveState.at,
                "startTime": driveState.clock
            };
            return driveState;
        }

        var isTurnoverOnDowns = function(play, driveState) {
            if (driveState.down !== 4) {
                return false;
            }
            if (play.yards >= driveState.distance) {
                return false;
            }

            return true;

        };

        var downFormatter = function(down) {
            var downs = ["1st", "2nd", "3rd", "4th"]
            return downs[down - 1];
        }

        var atFormatter = function(driveState) {
            var at = "";
            if (driveState.at <= 50) {
                if (driveState.possession === home.name) {
                    at += away.name;
                } else {
                    at += home.name;
                }
                return at += " " + driveState.at;
            } else {
                if (driveState.possession === home.name) {
                    at += home.name;
                } else {
                    at += away.name;
                }
                return at += " " + (100 - driveState.at);
            }
        }

        var atFormatterForAt = function(at, possession) {
            var result = "";
            if (at <= 50) {
                if (possession === home.name) {
                    result += away.shortName;
                } else {
                    result += home.shortName;
                }
                return result += " " + at;
            } else {
                if (possession === home.name) {
                    result += home.shortName;
                } else {
                    result += away.shortName;
                }
                return result += " " + (100 - at);
            }
        }

        var statUpdate = function(player, team, stat, change) {
            player.stats[stat] = (player.stats[stat] || 0) + change
            player.seasonStats[stat] = (player.seasonStats[stat] || 0) + change
            team.stats[stat] = (team.stats[stat] || 0) + change
            team.seasonStats[stat] = (team.seasonStats[stat] || 0) + change
        }

        var maxStatUpdate = function(player, team, stat, change) {

            player.stats[stat] = _.max([(player.stats[stat] || 0), change])
            player.seasonStats[stat] = _.max([(player.seasonStats[stat] || 0), change])
            team.stats[stat] = _.max([(team.stats[stat] || 0), change])
            team.seasonStats[stat] = _.max([(team.seasonStats[stat] || 0), change])
        }

        var teamStatUpdate = function(team, stat, change) {
            team.stats[stat] = (team.stats[stat] || 0) + change
            team.seasonStats[stat] = (team.seasonStats[stat] || 0) + change
        }



        var extraPoint = function(driveState) {
            var team = teams[driveState.possession];

            if (team.getCurrentStrategy() === "td") {
                return succesfulPat(driveState);
            }

            if (team.getCurrentStrategy() === "xp") {
                return unsuccesfulPat(driveState)
            }

            if (team.getCurrentStrategy() === "tp") {
                return succesfulTwoPointConversion(driveState);
            }

            if (team.getCurrentStrategy() === "tpf") {
                return unsuccesfulTwoPointConversion(driveState);
            }
        }

        var succesfulPat = function(driveState) {
            var team = teams[driveState.possession];
            var kicker = team.getKicker();

            statUpdate(kicker, team, "XPA", 1);
            driveState.commentary += commentaryGenerator.PAT(kicker);
            statUpdate(kicker, team, "XPM", 1);
            scoreboard.score(driveState.possession, driveState, kicker, 7, driveState.quarter);
            return driveState;
        }
        var unsuccesfulPat = function(driveState) {
            var team = teams[driveState.possession];
            var kicker = team.getKicker();

            statUpdate(kicker, team, "XPA", 1);
            driveState.commentary += commentaryGenerator.PATMiss(kicker);
            scoreboard.score(driveState.possession, driveState, kicker, 6, driveState.quarter);
            return driveState;
        }

        var succesfulTwoPointConversion = function(driveState) {
            var team = teams[driveState.possession];
            if (Math.random() < .5) {
                var rusher = team.getRusher();
                driveState.commentary += commentaryGenerator.TPSuccessRush(rusher);
                scoreboard.score(driveState.possession, driveState, rusher, 8, driveState.quarter);
            } else {
                var passer = team.getPasser();
                var receiver = team.getReceiver(passer.depth);
                driveState.commentary += commentaryGenerator.TPSuccessPass(passer, receiver);
                scoreboard.score(driveState.possession, driveState, passer, 8, driveState.quarter, receiver);
            }
            return driveState;

        }

        var unsuccesfulTwoPointConversion = function(driveState) {
            var team = teams[driveState.possession];
            if (Math.random() < .5) {
                var rusher = team.getRusher();
                driveState.commentary += commentaryGenerator.TPFailRush(rusher);
                scoreboard.score(driveState.possession, driveState, rusher, 6, driveState.quarter);
            } else {
                var passer = team.getPasser();
                var receiver = team.getReceiver(passer.depth);
                driveState.commentary += commentaryGenerator.TPFailPass(passer, receiver);
                scoreboard.score(driveState.possession, driveState, passer, 6, driveState.quarter);
            }
            return driveState;
        }


        var kickoffSetup = function(driveState) {
            driveState.kickoff = true;
            driveState.at = 65;
            driveState.down = 1;
            driveState.distance = 10;
            return driveState;
        }

        var overtimeSetup = function(driveState) {
            driveState.kickoff = false;
            driveState.at = 25;
            driveState.down = 1;
            driveState.distance = 10;
            driveState.driveNumber++;
            driveSummaries[driveState.driveNumber] = {
                "start": driveState.at,
                "startTime": driveState.clock
            };
            return driveState;
        }

        var clockFormatter = function(driveState) {
            var pad = function(n) {
                return (n < 10) ? ("0" + n) : n;
            }
            var clock = "Q" + driveState.quarter + "-";
            var min = Math.floor(driveState.clock / 60);
            var sec = driveState.clock - min * 60;
            clock += min + ":" + pad(sec.toFixed(2));
            return clock;
        }

        var driveSummaryPlayUpdate = function(type, distance) {
            var driveSummary = driveSummaries[driveState.driveNumber];
            driveSummary[type] = (driveSummary[type] || 0) + 1;
            driveSummary["distance"] = (driveSummary["distance"] || 0) + distance;
        }

        var driveSummaryEnd = function(type, driveState) {
            var driveSummary = driveSummaries[driveState.driveNumber];
            driveSummary["ending"] = type;
            driveSummary["end"] = driveState.at;
            driveSummary["endTime"] = driveState.clock;
        }

        var incompletePass = function(driveState, play) {
            if (isTurnoverOnDowns(play, driveState)) {
                return passingTurnoverOnDowns(driveState, play);
            }
            var team = teams[driveState.possession];
            var passer = team.getPasser();
            var receiver = team.getReceiver();
            statUpdate(passer, team, "PA", 1);
            statUpdate(passer, team, "C", 0);
            driveSummaryPlayUpdate("PA", 0);
            lateDownFail(team, driveState.down);

            driveState.down++;
            driveState.commentary = commentaryGenerator.incompletePass(passer, receiver, driveState.down, driveState.distance);
            return driveState;
        }

        var sack = function(driveState, play) {
            if (play.safety) {
                return passingSafety(driveState, play);
            }

            var team = teams[driveState.possession];
            var passer = team.getPasser();
            var defense = teams[otherTeam(driveState)];
            var tackler = defense.getSacker();
            statUpdate(tackler, defense, "SK", 1);

            statUpdate(passer, team, "RA", 1);
            statUpdate(passer, team, "RYDS", play.yards);
            driveSummaryPlayUpdate("RA", play.yards);
            lateDownFail(team, driveState.down);


            driveState.down++;
            driveState.commentary = commentaryGenerator.sack(passer, tackler, play.yards, driveState.down, driveState.distance);

            driveState.at -= play.yards;
            driveState.distance = Math.min(driveState.at, driveState.distance - play.yards);
            return driveState;
        }

        var pass = function(driveState, play) {
            if (play.touchdown) {
                return passingTouchdown(driveState, play);
            } else if (isTurnoverOnDowns(play, driveState)) {
                return passingTurnoverOnDowns(driveState, play);
            }
            var team = teams[driveState.possession];
            var passer = team.getPasser();
            var receiver = team.getReceiver(passer.depth);
            statUpdate(passer, team, "PA", 1);
            statUpdate(passer, team, "C", 1);
            statUpdate(passer, team, "PY", play.yards);
            statUpdate(receiver, team, "R", 1);
            statUpdate(receiver, team, "RECY", play.yards);

            driveSummaryPlayUpdate("PA", play.yards);


            driveState.at -= play.yards;
            if (play.yards >= driveState.distance) {
                teamStatUpdate(team, "FD", 1);
                lateDownSuccess(team, driveState.down)
                driveState.commentary = commentaryGenerator.passFirstDown(passer, receiver, play.yards, driveState.down, driveState.distance)
                driveState.down = 1;
                driveState.distance = Math.min(10, driveState.at);
            } else {
                lateDownFail(team, driveState.down)
                driveState.down++;
                driveState.distance = Math.min(driveState.at, driveState.distance - play.yards);
                driveState.commentary = commentaryGenerator.pass(passer, receiver, play.yards, driveState.down, driveState.distance)
            }

            return driveState;
        }

        var otherTeam = function(driveState) {
            if (driveState.possession === home.name) {
                return away.name;
            } else {
                return home.name
            }
        }

        var otherTeamByName = function(team) {
            if (team === home.name) {
                return away.name;
            } else {
                return home.name
            }
        }

        var rush = function(driveState, play) {
            if (play.touchdown) {
                return rushingTouchdown(driveState, play);
            } else if (play.safety) {
                return rushingSafety(driveState, play);
            } else if (isTurnoverOnDowns(play, driveState)) {
                return rushingTurnoverOnDowns(driveState, play);
            } else if (play.sack) {
                return sack(driveState, play);
            }
            var team = teams[driveState.possession];
            var rusher = team.getRusher();

            statUpdate(rusher, team, "RA", 1);
            statUpdate(rusher, team, "RYDS", play.yards);

            driveState.commentary = "";

            driveState.at -= play.yards;

            driveSummaryPlayUpdate("RA", play.yards);



            if (play.yards >= driveState.distance) {
                teamStatUpdate(team, "FD", 1);
                lateDownSuccess(team, driveState.down);
                driveState.commentary = commentaryGenerator.rushFirstDown(rusher, play.yards, driveState.down, driveState.distance)
                driveState.down = 1;
                driveState.distance = Math.min(10, driveState.at);
            } else {
                lateDownFail(team, driveState.down);
                driveState.down++;
                driveState.distance = Math.min(driveState.at, driveState.distance - play.yards);
                driveState.commentary = commentaryGenerator.rush(rusher, play.yards, driveState.down, driveState.distance)
            }

            return driveState;
        }

        var lateDownSuccess = function(team, down) {
            if (driveState.down === 3) {
                teamStatUpdate(team, "TDA", 1);
                teamStatUpdate(team, "TDS", 1);
            } else if (driveState.down === 4) {
                teamStatUpdate(team, "FDA", 1);
                teamStatUpdate(team, "FDS", 1);
            }
        }

        var lateDownFail = function(team, down) {
            if (driveState.down === 3) {
                teamStatUpdate(team, "TDA", 1);
            } else if (driveState.down === 4) {
                teamStatUpdate(team, "FDA", 1);
            }
        }

        var passingTouchdown = function(driveState, play) {
            var team = teams[driveState.possession];
            var passer = team.getPasser();
            var receiver = team.getReceiver(passer.depth);

            statUpdate(passer, team, "PA", 1);
            statUpdate(passer, team, "C", 1);
            statUpdate(passer, team, "PY", play.yards);
            statUpdate(passer, team, "PTD", 1);
            statUpdate(receiver, team, "R", 1);
            statUpdate(receiver, team, "RECTD", 1);
            statUpdate(receiver, team, "RECY", play.yards);
            lateDownSuccess(team, driveState.down);

            driveSummaryPlayUpdate("PA", play.yards);
            driveSummaryEnd("PASSING TOUCHDOWN", driveState);

            driveState.commentary = commentaryGenerator.passingTouchdown(passer, receiver, play.yards, driveState.down, driveState.distance)
            driveState = extraPoint(driveState);
            return kickoffSetup(driveState);
        }

        var rushingTouchdown = function(driveState, play) {
            var team = teams[driveState.possession];
            var rusher = team.getRusher();

            lateDownSuccess(team, driveState.down);

            statUpdate(rusher, team, "RA", 1);
            statUpdate(rusher, team, "RTDS", 1);
            statUpdate(rusher, team, "RYDS", play.yards);


            driveSummaryPlayUpdate("RA", play.yards);
            driveSummaryEnd("RUSHING TOUCHDOWN", driveState);

            driveState.commentary = commentaryGenerator.rushingTouchdown(rusher, play.yards, driveState.down, driveState.distance)
            driveState = extraPoint(driveState);
            return kickoffSetup(driveState);
        }

        var passingTurnoverOnDowns = function(driveState, play) {
            var team = teams[driveState.possession];
            var passer = team.getPasser();
            var receiver = team.getReceiver();
            lateDownFail(team, driveState.down);
            if (play.sack) {
                var defense = teams[otherTeam(driveState)];
                var tackler = defense.getSacker();
                statUpdate(tackler, defense, "SK", 1);
                statUpdate(passer, team, "RA", 1);
                statUpdate(passer, team, "RYDS", play.yards);
                driveSummaryPlayUpdate("RA", play.yards);
                driveState.commentary = commentaryGenerator.sackTOD(passer, tackler, play.yards, driveState.down, driveState.distance);

            } else if (play.incomplete) {
                statUpdate(passer, team, "PA", 1);
                statUpdate(passer, team, "C", 0);
                driveSummaryPlayUpdate("PA", play.yards);
                driveState.commentary = commentaryGenerator.incompletePassTOD(passer, receiver, play.yards, driveState.down, driveState.distance);
            } else {
                var receiver = team.getReceiver(passer.depth);
                statUpdate(passer, team, "PA", 1);
                statUpdate(passer, team, "C", 1);
                statUpdate(passer, team, "PY", play.yards);
                statUpdate(receiver, team, "R", 1);
                statUpdate(receiver, team, "RECY", play.yards);
                driveSummaryPlayUpdate("PA", play.yards);

                driveState.commentary = commentaryGenerator.completePassTOD(passer, receiver, play.yards, driveState.down, driveState.distance);
                driveState.at -= play.yards;
            }
            driveSummaryEnd("TURN OVER ON DOWNS", driveState);
            driveState = changePossession(driveState);
            return driveState;
        }

        var rushingTurnoverOnDowns = function(driveState, play) {
            var team = teams[driveState.possession];
            var rusher = team.getRusher();


            statUpdate(rusher, team, "RA", 1);
            statUpdate(rusher, team, "RYDS", play.yards);
            driveSummaryPlayUpdate("RA", play.yards);
            lateDownFail(team, driveState.down);



            driveState.commentary = commentaryGenerator.rushTOD(rusher, play.yards, driveState.down, driveState.distance)
            driveState.at -= play.yards;
            driveSummaryEnd("TURN OVER ON DOWNS", driveState);
            driveState = changePossession(driveState);
            return driveState;
        }

        var fumble = function(driveState, play) {
            var team = teams[driveState.possession];
            var recoveringTeam = teams[otherTeam(driveState)];
            var player = _.pickRandom([team.getRusher(), team.getPasser()]);
            var recoverer = recoveringTeam.getRecoverer();

            statUpdate(player, team, "FU", 1);
            statUpdate(player, team, "FL", 1);
            statUpdate(player, team, "RA", 1);
            driveSummaryPlayUpdate("RA", play.yards);
            lateDownFail(team, driveState.down);


            statUpdate(recoverer, recoveringTeam, "FR", 1);


            driveState.at = driveState.at - play.yards;
            driveSummaryEnd("FUMBLE", driveState);

            if (driveState.at === 0) {
                driveState.commentary = commentaryGenerator.touchbackFumbleRecovery(player, recoverer, driveState.down, driveState.distance);
                driveState.at = 25;
                driveState = changePossession(driveState);
            } else if (driveState.at === 100) {
                if (recoveringTeam.getCurrentStrategy() === "fg" || recoveringTeam.getCurrentStrategy() === "hld") {
                    driveState.at = 99;
                    driveState = changePossession(driveState);
                    driveState.commentary = commentaryGenerator.fumbleRecovery(player, recoverer, driveState.down, driveState.distance);
                } else {
                    driveState.commentary = commentaryGenerator.touchbackFumbleRecovery(player, recoverer, driveState.down, driveState.distance);
                    driveState = changePossession(driveState);
                    driveState = extraPoint(driveState);
                    driveState = kickoffSetup(driveState);
                }
            } else {
                driveState = changePossession(driveState);
                driveState.commentary = commentaryGenerator.fumbleRecovery(player, recoverer, driveState.down, driveState.distance);
            }

            return driveState;
        }

        var interception = function(driveState, play) {
            var team = teams[driveState.possession];
            var defense = teams[otherTeam(driveState)];
            var passer = team.getPasser();
            var receiver = team.getReceiver();
            var interceptor = defense.getInterceptor();

            statUpdate(passer, team, "PA", 1);
            statUpdate(passer, team, "C", 0);
            statUpdate(passer, team, "INT", 1);
            driveSummaryPlayUpdate("PA", play.yards);
            statUpdate(interceptor, defense, "INTD", 1);

            lateDownFail(team, driveState.down);



            var pickedAt = driveState.at - Math.round(_.randomBetween(0, Math.min(25, driveState.at)));
            var returnYards = Math.round(Math.max(_.normal(13.40219, 17.97221), 0));

            if (pickedAt + returnYards >= 100 && defense.getCurrentStrategy() !== "fg" && defense.getCurrentStrategy() !== "hld" && driveState.quarter < 5) {
                driveState.commentary = commentaryGenerator.tint(passer, receiver, interceptor, driveState.down, driveState.distance, atFormatterForAt(pickedAt, driveState.possession), returnYards);
                driveState = changePossession(driveState);
                driveState = extraPoint(driveState);
                driveState = kickoffSetup(driveState);
                return driveState;
            } else if (pickedAt + returnYards >= 100) {
                returnYards = 0;
            }

            driveState.commentary = commentaryGenerator.int(passer, interceptor, driveState.down, driveState.distance, atFormatterForAt(pickedAt, driveState.possession), returnYards);

            driveSummaryEnd("INTERCEPTION", driveState);

            driveState.at = pickedAt + returnYards;
            var driveState = changePossession(driveState);
            return driveState;



        }

        var fieldGoal = function(play, driveState) {
            var team = teams[driveState.possession];
            var kicker = team.getKicker();

            statUpdate(kicker, team, "FGA", 1);

            var updatedState;

            if (play.fieldGoalMade) {

                statUpdate(kicker, team, "FGM", 1);
                maxStatUpdate(kicker, team, "FGL", (driveState.at + 18));

                driveState.commentary = commentaryGenerator.fieldGoalMade(kicker, driveState.down, driveState.distance, driveState.at + 18);
                driveSummaryEnd("FIELD GOAL", driveState);
                updatedState = kickoffSetup(driveState);
                scoreboard.score(driveState.possession, driveState, kicker, 3, driveState.quarter);


            } else {
                statUpdate(kicker, team, "FGM", 0);
                driveState.commentary = commentaryGenerator.fieldGoalMiss(kicker, driveState.down, driveState.distance, driveState.at + 18);
                driveSummaryEnd("MISSED FIELD GOAL", driveState);
                updatedState = changePossession(driveState);
            }
            return updatedState;
        }

        var punt = function(driveState, play) {
            var puntingTeam = teams[driveState.possession];
            var punter = puntingTeam.getPunter();

            statUpdate(punter, puntingTeam, "P", 1);
            statUpdate(punter, puntingTeam, "PUYDS", play.distance);
            maxStatUpdate(punter, puntingTeam, "PL", play.distance);
            driveSummaryEnd("PUNT", driveState);

            var updatedDriveState;

            var receivingTeam = teams[otherTeam(driveState)];
            var returner = receivingTeam.getReturner();

            if (play.fairCatch) {
                driveState.at = driveState.at - play.distance;
                driveState = changePossession(driveState);
                driveState.commentary = commentaryGenerator.puntFairCatch(punter, play.yards, driveState.down, driveState.distance, returner, atFormatter(driveState))
                driveState.kickoff = false;
                updatedDriveState = driveState;
            } else if (play.touchback) {
                driveState.at = 25;
                driveState = changePossession(driveState);
                driveState.commentary = commentaryGenerator.puntTouchback(punter, play.yards, driveState.down, driveState.distance)
                driveState.kickoff = false;
                updatedDriveState = driveState;
            } else if (play.downed) {
                driveState.at = driveState.at - play.distance;
                driveState = changePossession(driveState);
                driveState.commentary = driveState.commentary = commentaryGenerator.puntDowned(punter, play.yards, driveState.down, driveState.distance, atFormatter(driveState))
                driveState.kickoff = false;
                updatedDriveState = driveState;
            } else if (play.outOfBounds) {
                driveState.at = driveState.at - play.distance;
                driveState = changePossession(driveState);
                driveState.commentary = driveState.commentary = commentaryGenerator.puntOOB(punter, play.yards, driveState.down, driveState.distance, atFormatter(driveState))
                driveState.kickoff = false;
                updatedDriveState = driveState;
            } else if (play.returned) {

                statUpdate(returner, receivingTeam, "PR", 1);
                statUpdate(returner, receivingTeam, "PRYDS", play.returnDistance);
                maxStatUpdate(returner, receivingTeam, "PRL", play.returnDistance);

                if (play.touchdown) {
                    statUpdate(returner, receivingTeam, "PRTD", 1);

                    driveState.at = driveState.at - play.distance;
                    driveState = changePossession(driveState);
                    driveState.commentary = commentaryGenerator.puntTD(punter, play.yards, driveState.down, driveState.distance, atFormatter(driveState), returner, play.returnDistance);
                    driveState = extraPoint(driveState);
                    updatedDriveState = kickoffSetup(driveState);
                } else {
                    driveState.at = driveState.at - play.distance;
                    driveState = changePossession(driveState);
                    driveState.distance = Math.min(10, driveState.at);
                    driveState.commentary = commentaryGenerator.puntReturn(punter, play.yards, driveState.down, driveState.distance, atFormatter(driveState), returner, play.returnDistance);
                    driveState.kickoff = false;
                    updatedDriveState = driveState;
                }
            } else {
                console.log(play);
            }

            return updatedDriveState;
        }

        var kickoff = function(driveState, play) {
            var team = teams[driveState.possession];
            var kicker = team.getKicker();

            statUpdate(kicker, team, "KO", 1);

            var receivingTeam = teams[otherTeam(driveState)];
            var returner = receivingTeam.getReturner();

            var updatedDriveState;
            if (play.fairCatch) {
                driveState.at = driveState.at - play.distance;
                driveState = changePossession(driveState);
                driveState.commentary = commentaryGenerator.kickFairCatch(kicker, play.distance, driveState.down, driveState.distance, returner, atFormatter(driveState));
                driveState.kickoff = false;
                updatedDriveState = driveState;
            } else if (play.touchback) {
                driveState.at = 25;
                driveState = changePossession(driveState);
                driveState.commentary = commentaryGenerator.kickTouchback(kicker, play.distance, driveState.down, driveState.distance);
                driveState.kickoff = false;
                updatedDriveState = driveState;
            } else if (play.downed) {
                driveState.at = driveState.at - play.distance;
                driveState = changePossession(driveState);
                driveState.commentary = driveState.commentary = commentaryGenerator.kickDowned(kicker, play.distance, driveState.down, driveState.distance, atFormatter(driveState));
                driveState.kickoff = false;
                updatedDriveState = driveState;
            } else if (play.returned) {
                statUpdate(returner, receivingTeam, "KOR", 1);
                statUpdate(returner, receivingTeam, "KORYDS", play.returnDistance);
                maxStatUpdate(returner, receivingTeam, "KORL", play.returnDistance);

                if (play.touchdown) {
                    statUpdate(returner, receivingTeam, "KORTD", 1);

                    driveState.at = driveState.at - play.distance;
                    driveState = changePossession(driveState);
                    driveState.commentary = commentaryGenerator.kickTD(kicker, play.distance, driveState.down, driveState.distance, atFormatter(driveState), returner, play.returnDistance);
                    driveState = extraPoint(driveState);
                    updatedDriveState = kickoffSetup(driveState);
                } else {
                    driveState.at = driveState.at - play.distance;
                    driveState = changePossession(driveState);
                    driveState.at = driveState.at - play.returnDistance;
                    driveState.distance = Math.min(10, driveState.at);
                    driveState.commentary = commentaryGenerator.kickReturn(kicker, play.distance, driveState.down, driveState.distance, atFormatter(driveState), returner, play.returnDistance);
                    driveState.kickoff = false;
                    updatedDriveState = driveState;
                }
            }
            return updatedDriveState;
        }

        var updateDriveState = function(play, driveState) {
            driveState.clock = Math.max(driveState.clock - teams[driveState.possession].tempo, 0);
            driveState.time += teams[driveState.possession].tempo * 1000 * 2;



            if (debugOn) {
                console.log(clockFormatter(driveState));
                console.log(scoreboard.homeScores.total + " " + scoreboard.awayScores.total);
            }
            if (play.type === "KICKOFF") {
                return kickoff(driveState, play)
            }

            if (play.type === "PUNT") {
                return punt(driveState, play)
            }

            if (play.type === "FIELD GOAL") {
                return fieldGoal(play, driveState);
            }

            if (play.turnover === "INTERCEPTION") {
                return interception(driveState, play);
            }

            if (play.turnover === "FUMBLE") {
                return fumble(driveState, play);
            }

            if (play.incomplete) {
                return incompletePass(driveState, play);
            }

            if (play.type === "PASS") {
                return pass(driveState, play);
            }

            if (play.type === "RUSH") {
                return rush(driveState, play);
            }

        };

        var playUntilNext = function() {
            var playsForNow = [];
            while (driveState.clock > 0 && driveState.quarter === 1) {
                playsForNow.push(play())
            }
            if (driveState.clock === 0 && driveState.quarter === 1) {
                var EOQ1 = {
                    commentary: "It was the end of the 1st quarter. The score: " + home.institution.name + " " + home.name + ": " + scoreboard.homeScores.total + ",  " + away.institution.name + " " + away.name + ": " + scoreboard.awayScores.total + ".",
                    homeScore: scoreboard.homeScores.total,
                    awayScore: scoreboard.awayScores.total,
                    possession: driveState.possession,
                    quarterChange: true,
                    driveNumber: driveState.driveNumber,
                    quarter: 1
                };
                plays.push(EOQ1);
                playsForNow.push(EOQ1);
                driveState.quarter = 2;
                driveState.clock = 900;
                driveState.time += 4 * 60 * 1000;
                return playsForNow;
            }

            while (driveState.clock > 0 && driveState.quarter === 2) {
                playsForNow.push(play())
            }
            if (driveState.clock === 0 && driveState.quarter === 2) {
                var EOQ2 = {
                   commentary: "It was the end of the 1st half. The score: " + home.institution.name + " " + home.name + ": " + scoreboard.homeScores.total + ",  " + away.institution.name + " " + away.name + ": " + scoreboard.awayScores.total + ".",
                    homeScore: scoreboard.homeScores.total,
                    awayScore: scoreboard.awayScores.total,
                    possession: driveState.possession,
                    driveNumber: driveState.driveNumber,
                    quarter: 2
                }
                plays.push(EOQ2);
                playsForNow.push(EOQ2);
                if (!driveSummaries[driveState.driveNumber].ending) {
                    driveSummaryEnd("END OF HALF", driveState);
                }
                driveState.driveNumber++;
                driveSummaries[driveState.driveNumber] = {
                    "start": driveState.at,
                    "startTime": driveState.clock
                };
                driveState.possession = otherTeamByName(firstToKick);
                driveState = kickoffSetup(driveState);

                driveState.quarter = 3;
                driveState.clock = 900;
                driveState.time += 20 * 60 * 1000;
                return playsForNow;
            }



            while (driveState.clock > 0 && driveState.quarter === 3) {
                playsForNow.push(play())
            }
            if (driveState.clock === 0 && driveState.quarter === 3) {
                var EOQ3 = {
                   commentary: "It was the end of the 3rd quarter. The score: " + home.institution.name + " " + home.name + ": " + scoreboard.homeScores.total + ",  " + away.institution.name + " " + away.name + ": " + scoreboard.awayScores.total + ".",
                    homeScore: scoreboard.homeScores.total,
                    awayScore: scoreboard.awayScores.total,
                    possession: driveState.possession,
                    quarterChange: true,
                    driveNumber: driveState.driveNumber,
                    quarter: 3
                };
                plays.push(EOQ3);
                playsForNow.push(EOQ3);
                driveState.quarter = 4;
                driveState.clock = 900;
                driveState.time += 4 * 60 * 1000;
                return playsForNow;
            }


            while (driveState.clock > 0 && driveState.quarter === 4) {
                playsForNow.push(play())
            }


            if (driveState.clock === 0 && driveState.quarter === 4) {
                var EOQ4 = {
                    commentary: "It was the end of regulation. The score: " + home.institution.name + " " + home.name + ": " + scoreboard.homeScores.total + ",  " + away.institution.name + " " + away.name + ": " + scoreboard.awayScores.total + ".",
                    homeScore: scoreboard.homeScores.total,
                    awayScore: scoreboard.awayScores.total,
                    possession: driveState.possession,
                    driveNumber: driveState.driveNumber,
                    quarter: 4
                };
                if (!driveSummaries[driveState.driveNumber].ending) {
                    driveSummaryEnd("END OF REGULATION", driveState);
                }

                plays.push(EOQ4);
                playsForNow.push(EOQ4);
                driveState.driveNumber++;

                driveState.quarter = 5;
                driveState.clock = 0;
                driveState.time += 10 * 60 * 1000;
                return playsForNow;
            }

            hasOTs++;


            var firstInOt = _.pickRandom([away.name, home.name]);
            var otStrategy;
            if (driveState.quarter > 6) {
                otStrategy = _.pickRandom(["fg", "tpf", "tp", "fg", "tpf", "tp", "hld"])
            } else {
                otStrategy = _.pickRandom(["fg", "fg", "fg", "tp", "td", "td", "td", "tpf", "hld"])
            }

            home.setCurrentStrategy(otStrategy);
            away.setCurrentStrategy(otStrategy);

            driveState.possession = firstInOt;
            driveState = overtimeSetup(driveState);

            var possessionInOt = driveState.possession;

            while (driveState.possession === possessionInOt && !driveState.kickoff) {
                playsForNow.push(play())
            }

            driveState.possession = otherTeamByName(possessionInOt);
            driveState = overtimeSetup(driveState);

            possessionInOt = driveState.possession;

            while (driveState.possession === possessionInOt && !driveState.kickoff) {
                playsForNow.push(play())
            }

            driveState.quarter++;

            var EOOT = {
                commentary: "It was the end of OT "+ hasOTs + ". The score: " + home.institution.name + " " + home.name + ": " + scoreboard.homeScores.total + ",  " + away.institution.name + " " + away.name + ": " + scoreboard.awayScores.total + ".",
                homeScore: scoreboard.homeScores.total,
                awayScore: scoreboard.awayScores.total,
                possession: driveState.possession,
                driveNumber: driveState.driveNumber,
                quarter: driveState.quarter
            };

            plays.push(EOOT);
            playsForNow.push(EOOT);

            return playsForNow;


        }

        var forDisplay = function(oldDriveState, newDriveState, scoreboard, play) {
            return {
                commentary: newDriveState.commentary,
                homeScore: scoreboard.homeScores.total,
                awayScore: scoreboard.awayScores.total,
                down: oldDriveState.down,
                at: oldDriveState.at,
                distance: oldDriveState.distance,
                possession: oldDriveState.possession,
                driveNumber: oldDriveState.driveNumber,
                quarter: oldDriveState.quarter,
                clock: oldDriveState.clock,
            }
        }

        var play = function() {
            if (debugOn) {
                console.log(driveState);
            }
            var play;
            if (driveState.kickoff) {
                play = kickoffGenerator.nextPlay(1, driveState.at, teams[otherTeam(driveState)])
            } else {
                play = playGenerator.nextPlay(driveState.quarter, driveState.down, driveState.distance, driveState.at, teams[driveState.possession], teams, scoreboard, driveState.clock);
            }

            var oldDriveState = genball.models.driveState().clone(driveState);
            driveState = updateDriveState(play, driveState);
            var displayPlay = forDisplay(oldDriveState, driveState, scoreboard);
            plays.push(displayPlay)
            return displayPlay;
        }



        return {
            playUntilNext: playUntilNext,
            play: play,
            teams: teams,
            driveSummaries: driveSummaries,
            scoreboard: scoreboard,
            plays: plays,
            stadium: stadium,
            completed: completed,
            winner: winner,
            hasOTs: hasOTs,
        }
    }

    return {
        next: next
    }
}
