var genball = genball || {};
genball.generators = genball.generators || {};

genball.generators.kickoffGenerator = function(data) {
    var nextPlay = function(quarter, at) {
        var possible = _.select(data, function(play) {
            var validReturn = true;
            if (play.RYDS) {
                validReturn = at - play.KYDS + play.RYDS > 0;
            }
            return play.KYDS <= at && validReturn && !play.ON && !play.OOB;
        })
        var kick = _.pickRandom(possible)
        return genball.models.kickoff(kick);
    }
    return {
        nextPlay: nextPlay
    }
}