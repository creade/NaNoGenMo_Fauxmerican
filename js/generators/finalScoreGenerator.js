var genball = genball || {};
genball.generators = genball.generators || {};

genball.generators.finalScoreGenerator = function () {
	var equivs = [
	[["td"], ["td"]],
	[["td"], ["td"]],
	[["td"], ["td"]],
	[["td"], ["td"]],
	[["td"], ["td"]],
	[["td"], ["td"]],
	[["fg"], ["fg"]],
	[["fg"], ["fg"]],
	[["fg"], ["fg"]],
	[["fg"], ["fg"]],
	[["fg"], ["fg"]],
	[["tp"], ["tp"]],
	]

	var next = function(){
		var pullNumber = _.randomBetween(4,7);
		var homeScores = [];
		var awayScores = [];
		for (var i = 0; i < pullNumber; i++) {
			var equiv = _.pickRandom(equivs);
			var teamIndex = _.pickRandom([0,1]);
			homeScores.push(equiv[teamIndex]);
			awayScores.push(equiv[1 - teamIndex]);
		};
		return {
			home: _.shuffle(_.flatten(homeScores)),
			away: _.shuffle(_.flatten(awayScores))
		}
	}

	return {
		next: next
	}
}