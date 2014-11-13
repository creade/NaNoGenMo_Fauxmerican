var genball = genball || {};
genball.generators = genball.generators || {};

genball.generators.lastNameGenerator = function(lastNames) {
    var next = function next() {
        return _.pickRandom(lastNames[0]);
    }

    return {
        next: next
    }
}
