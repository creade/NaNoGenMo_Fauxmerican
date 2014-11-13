var genball = genball || {};
genball.models = genball.models || {};

genball.models.punt = function (puntData) {
    return {
    	type: "PUNT",
    	fairCatch: !!puntData.Fc,
        downed: !!puntData.Dwn,
        blocked: !!puntData.Blk,
    	outOfBounds: !!puntData.Oob,
    	touchback: !!puntData.Tb,
    	returned: !!puntData.Ry || puntData.Ry === 0,
    	returnDistance: puntData.Ry,
    	touchdown: !!puntData.T,
        distance: puntData.Y
    }
}
