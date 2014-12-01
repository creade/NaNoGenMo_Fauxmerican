var genball = genball || {};
genball.generators = genball.generators || {};

genball.generators.commentaryGenerator = function() {
    var transitions = ["Next", "Then"];
    var passVerbs = ["threw", "heaved", "chucked", "lofted"];
    var sackVerbs = ["got leveled", "got lit up", "got hit", "was sacked", "was brought down in the pocket"];
    var passTypes = ["dart", "floater", "beautiful pass", "fade", "lob", "bullet"];
    var rushVerbs = ["darted ahead", "powered forward", "found a gap", "ran", "rushed", "spun outside", "took the pitch and ran"];
    var fumbleVerbs = ["mishandled the handoff", "had the ball stripped from his hands", "got hit hard"];
    var kickVerbs = ["booted", "kicked", "punched through", "nailed"];
    var puntVerbs = ["booted", "kicked", "boomed"];
    var kickMissVerbs = ["went wide left", "went wide right", "hit the cross bar", "fell short"];
    var downFormatter = function(down) {
        var downs = ["1st", "2nd", "3rd", "4th"]
        return downs[down - 1];
    }

    var passFirstDown = function(passer, receiver, yards, down, distance) {
        return _.template("<%= _.pickRandom(transitions) %>, on  <%= down %> and <%= distance %>, <%= passer.lastName %> <%= _.pickRandom(passVerbs) %> a <%= _.pickRandom(passTypes) %> to <%= receiver.lastName %> for <%= yards %> yards, enough to get them the first. ")
            ({
                transitions: transitions,
                down: downFormatter(down),
                distance: distance,
                passer: passer,
                passVerbs: passVerbs,
                passTypes: passTypes,
                receiver: receiver,
                yards: yards
            });
    }

    var pass = function(passer, receiver, yards, down, distance) {
        return _.template("<%= _.pickRandom(transitions) %>, on  <%= down %> and <%= distance %>, <%= passer.lastName %> <%= _.pickRandom(passVerbs) %> a <%= _.pickRandom(passTypes) %> to <%= receiver.lastName %> for <%= yards %> yards. ")
            ({
                transitions: transitions,
                down: downFormatter(down),
                distance: distance,
                passer: passer,
                passVerbs: passVerbs,
                passTypes: passTypes,
                receiver: receiver,
                yards: yards
            });
    }

    var passingTouchdown = function(passer, receiver, yards, down, distance) {
        return _.template("<%= _.pickRandom(transitions) %>, on  <%= down %> and <%= distance %>, <%= passer.lastName %> <%= _.pickRandom(passVerbs) %> a <%= _.pickRandom(passTypes) %> to <%= receiver.lastName %> in the end zone for a touchdown! ")
            ({
                transitions: transitions,
                down: downFormatter(down),
                distance: distance,
                passer: passer,
                passVerbs: passVerbs,
                passTypes: passTypes,
                receiver: receiver,
                yards: yards
            });
    }

    var incompletePass = function(passer, receiver, down, distance) {
        var oob = _.template("<%= _.pickRandom(transitions) %>, on  <%= down %> and <%= distance %>, <%= passer.lastName %> <%= _.pickRandom(passVerbs) %> a <%= _.pickRandom(passTypes) %> out of bounds. ");
        var drop = _.template("<%= _.pickRandom(transitions) %>, on  <%= down %> and <%= distance %>, <%= passer.lastName %> <%= _.pickRandom(passVerbs) %> a <%= _.pickRandom(passTypes) %> to <%= receiver.lastName %> but he just couldn't hang on to it. ");
        var tip = _.template("<%= _.pickRandom(transitions) %>, on  <%= down %> and <%= distance %>, <%= passer.lastName %> <%= _.pickRandom(passVerbs) %> a <%= _.pickRandom(passTypes) %> toward <%= receiver.lastName %> but it was tipped at the line and fell short. ");
        return _.pickRandom([oob, drop, tip])({
            transitions: transitions,
            down: downFormatter(down),
            distance: distance,
            passer: passer,
            passVerbs: passVerbs,
            passTypes: passTypes,
            receiver: receiver
        });
    }

    var sack = function(passer, tackler, yards, down, distance) {
        return _.template("<%= _.pickRandom(transitions) %>, on <%= down %> and <%= distance %>, <%= passer.lastName %> <%= _.pickRandom(sackVerbs) %> by <%= tackler.lastName %> for a loss of <%= yards %>. ")
            ({
                transitions: transitions,
                down: downFormatter(down),
                distance: distance,
                passer: passer,
                sackVerbs: sackVerbs,
                tackler: tackler,
                yards: yards
            });
    }

    var sackTOD = function(passer, tackler, yards, down, distance) {
        return _.template("<%= _.pickRandom(transitions) %>, they went for it on 4th and <%= distance %>, but <%= passer.lastName %> <%= _.pickRandom(sackVerbs) %> by <%= tackler.lastName %> for a loss of <%= yards %> and a turnover on downs. ")
            ({
                transitions: transitions,
                down: downFormatter(down),
                distance: distance,
                passer: passer,
                sackVerbs: sackVerbs,
                tackler: tackler,
                yards: yards
            });
    }

    var incompletePassTOD = function(passer, receiver, yards, down, distance) {
        var oob = _.template("<%= _.pickRandom(transitions) %>, they decided to go for it on  <%= down %> and <%= distance %>, <%= passer.lastName %> <%= _.pickRandom(passVerbs) %> a <%= _.pickRandom(passTypes) %> out of bounds. ");
        var drop = _.template("<%= _.pickRandom(transitions) %>, they decided to go for it on  <%= down %> and <%= distance %>, <%= passer.lastName %> <%= _.pickRandom(passVerbs) %> a <%= _.pickRandom(passTypes) %> to <%= receiver.lastName %> but he just couldn't hang on to it. ");
        var tip = _.template("<%= _.pickRandom(transitions) %>, they decided to go for it on  <%= down %> and <%= distance %>, <%= passer.lastName %> <%= _.pickRandom(passVerbs) %> a <%= _.pickRandom(passTypes) %> toward <%= receiver.lastName %> but it was tipped at the line and fell short. ");
        return _.pickRandom([oob, drop, tip])({
            transitions: transitions,
            down: downFormatter(down),
            distance: distance,
            passer: passer,
            passVerbs: passVerbs,
            passTypes: passTypes,
            receiver: receiver
        });
    }

    var completePassTOD = function(passer, receiver, yards, down, distance) {
        return _.template("<%= _.pickRandom(transitions) %>, they decided to go for it on  <%= down %> and <%= distance %> and <%= passer.lastName %> <%= _.pickRandom(passVerbs) %> a <%= _.pickRandom(passTypes) %> to <%= receiver.lastName %> for <%= yards %> yards, which wasn't enough to get them the first. ")
            ({
                transitions: transitions,
                down: downFormatter(down),
                distance: distance,
                passer: passer,
                passVerbs: passVerbs,
                passTypes: passTypes,
                receiver: receiver,
                yards: yards
            });
    }

    var rush = function(rusher, yards, down, distance) {
        return _.template("<%= _.pickRandom(transitions) %>, on <%= down %> and <%= distance %>, <%= rusher.lastName %> <%= _.pickRandom(rushVerbs) %> for <%= yards %> yards. ")
            ({
                transitions: transitions,
                down: downFormatter(down),
                distance: distance,
                rusher: rusher,
                rushVerbs: rushVerbs,
                yards: yards
            });
    }
    var rushTOD = function(rusher, yards, down, distance) {
        return _.template("<%= _.pickRandom(transitions) %>, they tried to go for it on <%= down %> and <%= distance %>, but <%= rusher.lastName %> <%= _.pickRandom(rushVerbs) %> for only <%= yards %> yards. ")
            ({
                transitions: transitions,
                down: downFormatter(down),
                distance: distance,
                rusher: rusher,
                rushVerbs: rushVerbs,
                yards: yards
            });
    }
    var rushFirstDown = function(rusher, yards, down, distance) {
        return _.template("<%= _.pickRandom(transitions) %>, on  <%= down %> and <%= distance %>, <%= rusher.lastName %> <%= _.pickRandom(rushVerbs) %> for <%= yards %> yards, enough for the first. ")
            ({
                transitions: transitions,
                down: downFormatter(down),
                distance: distance,
                rusher: rusher,
                rushVerbs: rushVerbs,
                yards: yards
            });
    }
    var rushingTouchdown = function(rusher, yards, down, distance) {
        return _.template("<%= _.pickRandom(transitions) %>, on  <%= down %> and <%= distance %>, <%= rusher.lastName %> <%= _.pickRandom(rushVerbs) %> for <%= yards %> yards into the endzone for a touchdown! ")
            ({
                transitions: transitions,
                down: downFormatter(down),
                distance: distance,
                rusher: rusher,
                rushVerbs: rushVerbs,
                yards: yards
            });
    }

    var touchbackFumbleRecovery = function(player, recoverer, down, distance) {
        return _.template("<%= _.pickRandom(transitions) %>, on  <%= down %> and <%= distance %>, <%= player.lastName %> <%= _.pickRandom(fumbleVerbs)%> fumbling the ball forward into the endzone where <%= recoverer.lastName %> fell on it for a touchback. ")
            ({
                transitions: transitions,
                down: downFormatter(down),
                distance: distance,
                fumbleVerbs: fumbleVerbs,
                recoverer: recoverer
            });
    };
    var fumbleRecovery = function(player, recoverer, down, distance) {
        return _.template("<%= _.pickRandom(transitions) %>, on  <%= down %> and <%= distance %>, <%= player.lastName %> <%= _.pickRandom(fumbleVerbs)%>, fumbling the ball! <%= recoverer.fullName%> fell on it. ")
            ({
                transitions: transitions,
                down: downFormatter(down),
                distance: distance,
                fumbleVerbs: fumbleVerbs,
                recoverer: recoverer
            });
    };

    var fieldGoalMade = function(kicker, down, distance, kickDistance) {
        return _.template("<%= _.pickRandom(transitions) %>, on  <%= down %> and <%= distance %>, <%= kicker.lastName %> <%= _.pickRandom(kickVerbs)%> a <%= kickDistance %> yard field goal! ")
            ({
                transitions: transitions,
                down: downFormatter(down),
                distance: distance,
                kickDistance: kickDistance,
                kickVerbs: kickVerbs,
                kicker: kicker
            });
    };
    var fieldGoalMiss = function(kicker, down, distance, kickDistance) {
        return _.template("<%= _.pickRandom(transitions) %>, on  <%= down %> and <%= distance %>, <%= kicker.lastName %> tried a <%= kickDistance %> yard field goal, but it <%= _.pickRandom(kickMissVerbs)%>! ")
            ({
                transitions: transitions,
                down: downFormatter(down),
                distance: distance,
                kickDistance: kickDistance,
                kickMissVerbs: kickMissVerbs,
                kicker: kicker
            });
    };

    var puntFairCatch = function(punter, puntYards, down, distance, returner, newSpot) {
        return _.template("<%= _.pickRandom(transitions) %>, on  <%= down %> and <%= distance %>, <%= punter.lastName %> <%= _.pickRandom(puntVerbs)%> a <%= puntYards%> yard punt to the  <%= newSpot%> where <%= returner.lastName%> called for a fair catch. ")
            ({
                transitions: transitions,
                down: downFormatter(down),
                distance: distance,
                puntYards: puntYards,
                puntVerbs: puntVerbs,
                returner: returner,
                punter: punter,
                newSpot: newSpot
            });
    };
    var puntTouchback = function(punter, puntYards, down, distance) {
        return _.template("<%= _.pickRandom(transitions) %>, on  <%= down %> and <%= distance %>, <%= punter.lastName %> <%= _.pickRandom(puntVerbs)%> a <%= puntYards%> yard punt into the endozone for a touchback. ")
            ({
                transitions: transitions,
                down: downFormatter(down),
                distance: distance,
                puntYards: puntYards,
                puntVerbs: puntVerbs,
                punter: punter,
            });
    };

    var puntDowned = function(punter, puntYards, down, distance, newSpot) {
        return _.template("<%= _.pickRandom(transitions) %>, on  <%= down %> and <%= distance %>, <%= punter.lastName %> <%= _.pickRandom(puntVerbs)%> a <%= puntYards%> yard punt to the <%= newSpot%> where it was downed. ")
            ({
                transitions: transitions,
                down: downFormatter(down),
                distance: distance,
                puntYards: puntYards,
                newSpot: newSpot,
                puntVerbs: puntVerbs,
                punter: punter,
            });
    };
    var puntOOB = function(punter, puntYards, down, distance, newSpot) {
        return _.template("<%= _.pickRandom(transitions) %>, on  <%= down %> and <%= distance %>, <%= punter.lastName %> <%= _.pickRandom(puntVerbs)%> a <%= puntYards%> yard punt out of bounds at the <%= newSpot%>. ")
            ({
                transitions: transitions,
                down: downFormatter(down),
                distance: distance,
                puntYards: puntYards,
                newSpot: newSpot,
                puntVerbs: puntVerbs,
                punter: punter,
            });
    };

    var puntTD = function(punter, puntYards, down, distance, newSpot, returner, returnDisatnce) {
        return _.template("<%= _.pickRandom(transitions) %>, on  <%= down %> and <%= distance %>, <%= punter.lastName %> <%= _.pickRandom(puntVerbs)%> a <%= puntYards%> yard punt to the <%= newSpot%> where <%= returner.lastName %> caught it and returned it <%= returnDisatnce %> yards for a touchdown! ")
            ({
                transitions: transitions,
                down: downFormatter(down),
                distance: distance,
                puntYards: puntYards,
                newSpot: newSpot,
                puntVerbs: puntVerbs,
                punter: punter,
                returnDisatnce: returnDisatnce,
                returner: returner
            });
    };
    var puntReturn = function(punter, puntYards, down, distance, newSpot, returner, returnDisatnce) {
        return _.template("<%= _.pickRandom(transitions) %>, on  <%= down %> and <%= distance %>, <%= punter.lastName %> <%= _.pickRandom(puntVerbs)%> a <%= puntYards%> yard punt to the <%= newSpot%> where <%= returner.lastName %> caught it and returned it <%= returnDisatnce %> yards. ")
            ({
                transitions: transitions,
                down: downFormatter(down),
                distance: distance,
                puntYards: puntYards,
                newSpot: newSpot,
                puntVerbs: puntVerbs,
                punter: punter,
                returnDisatnce: returnDisatnce,
                returner: returner
            });
    };

    var kickFairCatch = function(kicker, kickYards, down, distance, returner, newSpot) {
        return _.template("<%= _.pickRandom(transitions) %>, on  <%= down %> and <%= distance %>, <%= kicker.lastName %> <%= _.pickRandom(kickVerbs)%> a <%= kickYards%> yard kick to the  <%= newSpot%> where <%= returner.lastName%> called for a fair catch. ")
            ({
                transitions: transitions,
                down: downFormatter(down),
                distance: distance,
                kickYards: kickYards,
                kickVerbs: puntVerbs,
                returner: returner,
                kicker: kicker,
                newSpot: newSpot
            });
    };
    var kickTouchback = function(kicker, kickYards, down, distance) {
        return _.template("<%= _.pickRandom(transitions) %>, on  <%= down %> and <%= distance %>, <%= kicker.lastName %> <%= _.pickRandom(kickVerbs)%> a <%= kickYards%> yard kick into the endozone for a touchback. ")
            ({
                transitions: transitions,
                down: downFormatter(down),
                distance: distance,
                kickYards: kickYards,
                kickVerbs: puntVerbs,
                kicker: kicker,
            });
    };

    var kickDowned = function(kicker, kickYards, down, distance, newSpot) {
        return _.template("<%= _.pickRandom(transitions) %>, on  <%= down %> and <%= distance %>, <%= kicker.lastName %> <%= _.pickRandom(kickVerbs)%> a <%= kickYards%> yard kick to the <%= newSpot%> where it was downed. ")
            ({
                transitions: transitions,
                down: downFormatter(down),
                distance: distance,
                kickYards: kickYards,
                newSpot: newSpot,
                kickVerbs: puntVerbs,
                kicker: kicker,
            });
    };


    var kickTD = function(kicker, kickYards, down, distance, newSpot, returner, returnDisatnce) {
        return _.template("<%= _.pickRandom(transitions) %>, on  <%= down %> and <%= distance %>, <%= kicker.lastName %> <%= _.pickRandom(kickVerbs)%> a <%= kickYards%> yard kick to the <%= newSpot%> where <%= returner.lastName %> caught it and returned it <%= returnDisatnce %> yards for a touchdown! ")
            ({
                transitions: transitions,
                down: downFormatter(down),
                distance: distance,
                kickYards: kickYards,
                newSpot: newSpot,
                kickVerbs: puntVerbs,
                kicker: kicker,
                returnDisatnce: returnDisatnce,
                returner: returner
            });
    };
    var kickReturn = function(kicker, kickYards, down, distance, newSpot, returner, returnDisatnce) {
        return _.template("<%= _.pickRandom(transitions) %>, on  <%= down %> and <%= distance %>, <%= kicker.lastName %> <%= _.pickRandom(kickVerbs)%> a <%= kickYards%> yard kick to the <%= newSpot%> where <%= returner.lastName %> caught it and returned it <%= returnDisatnce %> yards. ")
            ({
                transitions: transitions,
                down: downFormatter(down),
                distance: distance,
                kickYards: kickYards,
                newSpot: newSpot,
                kickVerbs: puntVerbs,
                kicker: kicker,
                returnDisatnce: returnDisatnce,
                returner: returner
            });
    };

    var PAT = function(kicker) {
        return _.template("<%= kicker.lastName %> <%= _.pickRandom(kickVerbs)%> the point after. ")
            ({
                kickVerbs: puntVerbs,
                kicker: kicker,
            });
    }

    var PATMiss = function(kicker) {
        return _.template("<%= kicker.lastName %> came on for the extra point, but it <%= _.pickRandom(kickMissVerbs)%>. ")
            ({
                kickMissVerbs: kickMissVerbs,
                kicker: kicker,
            });
    }

    var TPSuccessRush = function(rusher) {
        return _.template("<%= rusher.lastName %> <%= _.pickRandom(rushVerbs)%> into the endzone for 2 points. ")({
            rusher: rusher,
            rushVerbs: rushVerbs
        });
    }

    var TPSuccessPass = function(passer, receiver) {
        return _.template("<%= passer.lastName %> <%= _.pickRandom(passVerbs)%> a <%= _.pickRandom(passTypes)%> to <%= receiver.lastName %> in the endzone for 2 points. ")({
            passer: passer,
            receiver: receiver,
            passVerbs: passVerbs,
            passTypes: passTypes
        });
    }

    
    var TPFailRush = function(rusher) {
        return _.template("On the two point conversion, <%= rusher.lastName %> <%= _.pickRandom(rushVerbs) %> short of the endzone. ")
            ({
                rusher: rusher,
                rushVerbs: rushVerbs
            });
    }

    var TPFailPass = function(passer, receiver) {
        var oob = _.template("On the two point conversion, <%= passer.lastName %> <%= _.pickRandom(passVerbs) %> a <%= _.pickRandom(passTypes) %> out of bounds. ");
        var drop = _.template("On the two point conversion, <%= passer.lastName %> <%= _.pickRandom(passVerbs) %> a <%= _.pickRandom(passTypes) %> to <%= receiver.lastName %> but he just couldn't hang on to it. ");
        var tip = _.template("On the two point conversion, <%= passer.lastName %> <%= _.pickRandom(passVerbs) %> a <%= _.pickRandom(passTypes) %> toward <%= receiver.lastName %> but it was tipped at the line and fell short. ");
        return _.pickRandom([oob, drop, tip])({
            passer: passer,
            passVerbs: passVerbs,
            passTypes: passTypes,
            receiver: receiver
        });
    }

    var tint = function(passer, receiver, interceptor, down, distance, pickedAt, returnYards){
		    return _.template("<%= _.pickRandom(transitions) %>, on  <%= down %> and <%= distance %>, <%= passer.lastName %> <%= _.pickRandom(passVerbs) %> a <%= _.pickRandom(passTypes) %> to <%= receiver.lastName %> but <%= interceptor.lastName %> intercepted it at the <%= pickedAt %> and returned it <%= returnYards %> yards for a touchdown! ")
            ({
                transitions: transitions,
                down: downFormatter(down),
                distance: distance,
                passer: passer,
                passVerbs: passVerbs,
                passTypes: passTypes,
                receiver: receiver,
                interceptor: interceptor,
                returnYards: returnYards,
                pickedAt: pickedAt
            });	
    }
    var int = function(passer, receiver, interceptor, down, distance, pickedAt, returnYards){
		    return _.template("<%= _.pickRandom(transitions) %>, on  <%= down %> and <%= distance %>, <%= passer.lastName %> <%= _.pickRandom(passVerbs) %> a <%= _.pickRandom(passTypes) %> to <%= receiver.lastName %> but <%= interceptor.lastName %> intercepted it at the <%= pickedAt %> and returned it <%= returnYards %> yards. ")
            ({
                transitions: transitions,
                down: downFormatter(down),
                distance: distance,
                passer: passer,
                passVerbs: passVerbs,
                passTypes: passTypes,
                receiver: receiver,
                interceptor: interceptor,
                returnYards: returnYards,
                pickedAt: pickedAt
            });	
    }

    return {
        passFirstDown: passFirstDown,
        pass: pass,
        sack: sack,
        sackTOD: sackTOD,
        rush: rush,
        rushFirstDown: rushFirstDown,
        rushingTouchdown: rushingTouchdown,
        passingTouchdown: passingTouchdown,
        incompletePass: incompletePass,
        incompletePassTOD: incompletePassTOD,
        completePassTOD: completePassTOD,
        rushTOD: rushTOD,
        touchbackFumbleRecovery: touchbackFumbleRecovery,
        fumbleRecovery: fumbleRecovery,
        fieldGoalMade: fieldGoalMade,
        fieldGoalMiss: fieldGoalMiss,
        puntFairCatch: puntFairCatch,
        puntTouchback: puntTouchback,
        puntDowned: puntDowned,
        puntOOB: puntOOB,
        puntTD: puntTD,
        puntReturn: puntReturn,
        kickFairCatch: kickFairCatch,
        kickTouchback: kickTouchback,
        kickDowned: kickDowned,
        kickTD: kickTD,
        kickReturn: kickReturn,
        PAT: PAT,
        PATMiss: PATMiss,
        TPSuccessPass: TPSuccessPass,
        TPSuccessRush: TPSuccessRush,
        TPFailPass: TPFailPass,
        TPFailRush: TPFailRush,
        tint: tint,
        int: int

    }
}
