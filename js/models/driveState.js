var genball = genball || {};
genball.models = genball.models || {};

genball.models.driveState = function () {
	var newDriveState = function(firstPossession){
		return {
			"possession":firstPossession,
			"down":1,
			"distance":10,
			"at":65,
			"commentary":"",
			"kickoff":true,
			"clock":900,
			"quarter":1,
			"driveNumber":0
		};
	}
	var clone = function(driveState){
		return {
			"possession":driveState.possession,
			"down":      driveState.down,
			"distance":  driveState.distance,
			"at":        driveState.at,
			"commentary":driveState.commentary,
			"kickoff" :  driveState.kickoff,
			"clock":     driveState.clock,
			"quarter":   driveState.quarter,
			"time":      driveState.time,
			"driveNumber": driveState.driveNumber

		};
	};
	return {
		newDriveState: newDriveState,
		clone: clone
	}
}