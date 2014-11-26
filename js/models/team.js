var genball = genball || {};
genball.models = genball.models || {};

genball.models.team = function(info, coach, OC, DC, tempo, players, institution, stadium, id, logo, skill, defSkill, finalScores) {
    var currentPasser;
    var passesRemaining;
    var scores = finalScores
    var currentStrategy = scores.pop();


    var getKicker = function() {
        return _.find(players, function(player) {
            return player.position === "K";
        })
    }
    var getPunter = function() {
        return _.find(players, function(player) {
            return player.position === "P";
        })
    }
    var getRushers = function() {
        return _.select(players, function(player) {
            return player.rushChance;
        })
    }

    var getReturners = function() {
        return _.select(players, function(player) {
            return player.returnChance;
        })
    };

    var getInterceptors = function() {
        return _.select(players, function(player) {
            return player.interceptionChance;
        })
    };

    var getSackers = function() {
        return _.select(players, function(player) {
            return player.sackChance;
        })
    };

    var getPassers = function() {
        return _.select(players, function(player) {
            return player.passChance;
        })
    }

    var getReceiver = function(passerDepth) {
        var receiver;
        while (!receiver || passerDepth === receiver.depth) {
            var chance = Math.random();
            receiver = _.find(_.sortBy(getReceivers(), "receiveChance"), function(player) {
                return chance <= player.receiveChance;
            });
        }
        return receiver;

    }

    var getReceivers = function() {
        return _.select(players, function(player) {
            return player.receiveChance;
        })
    }

    var getPasser = function() {
        if (!currentPasser || passesRemaining === 0) {
            var chance = Math.random();
            var passer = _.find(_.sortBy(getPassers(), "passChance"), function(player) {
                return chance <= player.passChance;
            });
            currentPasser = passer;
            passesRemaining = Math.round((1 - passer.passChance) * 5);
            return passer;
        }
        passesRemaining--;
        return currentPasser;
    }

    var getRusher = function() {
        var chance = Math.random();
        return _.find(_.sortBy(getRushers(), "rushChance"), function(player) {
            return chance <= player.rushChance;
        });
    }

    var getReturner = function() {
        var chance = Math.random();
        return _.find(_.sortBy(getReturners(), "returnChance"), function(player) {
            return chance <= player.returnChance;
        });
    }

    var getInterceptor = function() {
        var chance = Math.random();
        return _.find(_.sortBy(getInterceptors(), "interceptionChance"), function(player) {
            return chance <= player.interceptionChance;
        });
    }

    var getSacker = function() {
        var chance = Math.random();
        return _.find(_.sortBy(getSackers(), "sackChance"), function(player) {
            return chance <= player.sackChance;
        });
    }




    var recoverers = _.chain(players)
        .select(function(player) {
            return _.contains(["DB", "LB", "DL"], player.position);
        })
        .sample(10)
        .value();


    var getRecoverer = function() {
        return _.pickRandom(recoverers);
    }

    var nextStrategy = function(){
        if(scores.length > 0){
            currentStrategy = scores.pop();
        } else {
            currentStrategy = "hld";
        }
    }

    var getCurrentStrategy = function(){
        return currentStrategy;
    }

    var setCurrentStrategy = function(strategy){
        currentStrategy = strategy
    }

    return {
        getKicker: getKicker,
        getPunter: getPunter,
        getPasser: getPasser,
        getInterceptor: getInterceptor,
        getReceiver: getReceiver,
        getRusher: getRusher,
        getRecoverer: getRecoverer,
        getReturner: getReturner,
        getSacker: getSacker,
        name: info.N,
        rankings: [],
        logo: logo,
        color: info.teamColor,
        shortName: institution.shortName,
        coach: coach,
        getCurrentStrategy: getCurrentStrategy,
        setCurrentStrategy: setCurrentStrategy,
        nextStrategy: nextStrategy,
        scores: scores,
        OC: OC,
        DC: DC,
        tempo: tempo,
        id: id,
        players: _.sortBy(players, "lastName"),
        institution: institution,
        stadium: stadium,
        record: {
            wins: 0,
            losses: 0,
            history: ["(0-0)"]
        },
        skill: skill,
        defSkill: defSkill,
        stats: [],
        seasonStats: {}
    }
}
