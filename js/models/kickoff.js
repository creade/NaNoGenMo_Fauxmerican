var genball = genball || {};
genball.models = genball.models || {};

genball.models.kickoff = function (kickoffData) {
    return {
    	type: "KICKOFF",
    	fairCatch: kickoffData.FC,
    	downed: kickoffData.DWN,
    	touchback: kickoffData.TB,
    	returned: kickoffData.RYDS || kickoffData.RYDS === 0,
    	returnDistance: kickoffData.RYDS,
    	touchdown: kickoffData.TD,
        distance: kickoffData.KYDS
    }
}
