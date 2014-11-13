$(document).ready(function() {
    $.when(
        $.getJSON("js/data/team_data.json"),
        $.getJSON("js/data/first_names.json"),
        $.getJSON("js/data/last_names.json"),
        $.getJSON("js/data/play_by_q_and_dn.json"),
        $.getJSON("js/data/kickdata.json"),
        $.getJSON("img/logos.json")
    ).done(function(teamData, firstNames, lastNames, playData, kickdata, logos) {
        var lastNameGenerator = genball.generators.lastNameGenerator(lastNames);
        var firstNameGenerator = genball.generators.firstNameGenerator(firstNames);
        var teamGenerator = genball.generators.teamGenerator(teamData, firstNameGenerator, lastNameGenerator, logos);
        var homeTeam = teamGenerator.newTeam();
        var awayTeam = teamGenerator.newTeam();
        var seed =  Math.random().toString(36).substring(7);
        Math.seedrandom(seed);

        var gameGenerator = genball.generators.gameGenerator();

        game = gameGenerator.next(playData[0], kickdata[0], homeTeam, awayTeam,
                1,  seed, homeTeam.stadium, false)
        game.playUntilNext();
        
    })
})
