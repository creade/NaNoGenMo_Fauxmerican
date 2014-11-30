var genball = genball || {};
genball.generators = genball.generators || {};

genball.generators.commentaryGenerator = function() {
    var transitions = ["Next", "Then"];
    var passVerbs = ["threw", "heaved", "chucked", "lofted"];
    var sackVerbs = ["got leveled", "got lit up", "got hit", "was sacked", "was brought down in the pocket"];
    var passTypes = ["dart", "floater", "beautiful pass", "fade", "lob", "bullet"];
    var rushVerbs = ["darted ahead", "powered forward", "found a gap", "ran", "rushed", "spun outside", "took the pitch and ran"];
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
        incompletePassTOD: incompletePassTOD
    }
}
