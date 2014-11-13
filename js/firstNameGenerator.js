var genball = genball || {};
genball.generators = genball.generators || {};

genball.generators.firstNameGenerator = function(firstNames) {
    var next = function next() {
        return _.pickRandom(firstNames[0]);
    }

    return {
        next: next
    }
}
