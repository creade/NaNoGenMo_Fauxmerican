var genball = genball || {};
genball.models = genball.models || {};

genball.models.scoreboard = function (home, away) {
    var quarters = {
        1: "first",
        2: "second",
        3: "third",
        4: "fourth",
        5: "OT"
    }

    var teamScore = function (team) {
        return {
            quarters: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            total: 0
        }
    }

    var forDisplay = function(driveState,leadChanged,points, scoringTeam){
        return {
            "possession":driveState.possession,
            "down":      driveState.down,
            "distance":  driveState.distance,
            "at":        driveState.at,
            "commentary":driveState.commentary,
            "kickoff" :  driveState.kickoff,
            "leadChange": leadChanged,
            "clock":     driveState.clock,
            "quarter":   driveState.quarter,
            "time":      driveState.time,
            "driveNumber": driveState.driveNumber,
            "homeScore": homeScores.total,
            "awayScore": awayScores.total,
            "home": home,
            "away": away,
            "scoringTeam": scoringTeam,
            "points": points
        };
    };

    var teamScores = {};
    var homeScores = teamScore();
    var awayScores = teamScore();
    var scoringPlays = [];

    var score = function (team, driveState, play, points, quarter) {
        var scoringTeam;
        if (team === home.name) {
            var line = homeScores;
            scoringTeam = home;
        } else {
            scoringTeam = away;
            var line = awayScores;
        }
        var leadChanged = leadChange(team, points);

        line.total = line.total + points;
        
        line.quarters[quarter - 1] = (line.quarters[quarter - 1] + points);
        scoringPlays.push(forDisplay(driveState, leadChanged,points, scoringTeam));
    }

    var getDifferenital = function(team){
        if(team.name === home.name || team === home.name){
            return homeScores.total - awayScores.total;
        } 
        return awayScores.total - homeScores.total;
    }

    var leadChange = function(team, points){
          if(team === home.name || team === home.name){
            return _.signChange(homeScores.total + points - awayScores.total, getDifferenital(team));
        } 
        return _.signChange(awayScores.total + points - homeScores.total, getDifferenital(team));
    }



    return {
        score: score,
        getDifferenital: getDifferenital,
        homeScores: homeScores,
        awayScores: awayScores,
        scoringPlays: scoringPlays
    }
}