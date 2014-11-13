var genball = genball || {};
genball.models = genball.models || {};

genball.models.play = function (playData) {
    var types = {
        "PA":"PASS",
        "R":"RUSH",
        "N":"PUNT",
        "FG":"FIELD GOAL"
    }
    var fumble = playData.Fl;
    var recoveredFumble = playData.Fu && !fumble;
    var interception = playData.I;

    var turnover = function () {
        if (fumble) {
            return "FUMBLE";
        }
        if (interception) {
            return "INTERCEPTION";
        }
        return false;
    }

    var incomplete = function(){
        return playData.Ty === "PA" && playData.C === 0;
    }


    var sack = function(){
        return playData.Ty === "R" && playData.Sk === 1;
    }
    

    return {
        type:types[playData.Ty],
        yards:playData.Y,
        touchdown:!!playData.T,
        turnover:turnover(),
        fieldGoalMade: !!playData.FGM,
        incomplete: incomplete(),
        sack: sack(),
        safety: playData.St,
        recoveredFumble: recoveredFumble
    }
}
