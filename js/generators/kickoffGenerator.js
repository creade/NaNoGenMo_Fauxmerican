var genball = genball || {};
genball.generators = genball.generators || {};

genball.generators.kickoffGenerator = function(data) {
    
    
    var nextPlay = function(quarter, at, team) {
        var possible = _.select(data, function(play) {
            var validReturn = true;
            var validScore = true;
            if (play.RYDS) {
                validReturn = at - play.KYDS + play.RYDS > 0;
            }

            if(team.getCurrentStrategy() === "fg" || team.getCurrentStrategy() === "hld")
            {
                validScore = (_.isUndefined(play.TD) || play.TD === 0)
            }

            return play.KYDS <= at && validReturn && !play.ON && !play.OOB && validScore;
        })

        if(possible.length === 0 ){
            console.log(quarter + " " + at + " "+team.getCurrentStrategy())

        }

        var kick = _.pickRandom(possible)
        return genball.models.kickoff(kick);
    }
    return {
        nextPlay: nextPlay
    }
}