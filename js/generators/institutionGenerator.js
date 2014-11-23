 var genball = genball || {};
 genball.generators = genball.generators || {};

 genball.generators.institutionGenerator = function(places) {

     var next = function() {
         var prefixes = ["Western ", "Northern ", "Eastern ", "Southern ", "Northeastern ",
             "Northwestern ", "Southwestern ", "Southeastern "
         ];
         var suffixes = [" University", " A&M", " Tech", " College", " State"];

         var placeData = _.popRandom(places);
         var hasPrefix = false;
         var name = "";
         var logoLetter = "";
         if (Math.random() > .45) {
             hasPrefix = true;
             name += _.pickRandom(prefixes);
         } else if (Math.random() > .5) {
             name += "University of ";
         }
         name += placeData.N;

         if (name.indexOf("University") < 0) {

             if (!hasPrefix && name[0] !== "S") {
                 suffixes.push(" Institute of Technology");
                 suffixes.push(" State University");
             }

             name += _.pickRandom(suffixes);

             if (Math.random() > .5) {
                 logoLetter = name[0];
             } else {
                 var placeNameArray = name.split(" ");
                 logoLetter = _.reduce(placeNameArray, function(memo, word) {
                     if (word === "" || word === "of" || word === "A&M") {
                         return memo;
                     }
                     return memo.concat(word[0]);
                 }, "")
             }
         } else {
             var placeNameArray = placeData.N.split(" ");
             if (placeNameArray.length > 1) {
                 logoLetter = _.reduce(placeNameArray, function(memo, word) {
                     if (word === "" || word === "of") {
                         return memo;
                     }
                     return memo.concat(word[0]);
                 }, "U")
             } else {
                 logoLetter = placeData.N[0];
             }
         }

         var shortName;

         if (logoLetter.length === 3 || logoLetter.length === 4) {
             shortName = logoLetter;
         } else {
             var placeNameArray = placeData.N.split(" ");
             var shortWords = _.select(placeNameArray, function(word) {
                 return word.length === 3 || word.length === 4
             });

             if (shortWords.length > 0) {
                 shortName = _.pickRandom(shortWords).toUpperCase();
             } else {
                 var withoutVowels = _.map(placeNameArray, function(word) {
                     var firstLetter = word[0];
                     var rest = word.slice(1);
                     return firstLetter + rest.replace(/[aeiou]/ig, '');

                 });

                 var noVowels = _.select(withoutVowels, function(word) {
                     return word.length === 3 || word.length === 4;
                 });

                 if (noVowels.length > 0) {
                     shortName = _.pickRandom(noVowels).toUpperCase();
                 } else {
                     shortName = _.sortBy(withoutVowels, "length")[0].substring(0, 3).toUpperCase();
                 }

             }
         }


         return {
             location: placeData.N,
             name: name,
             shortName: shortName,
             logoLetter: logoLetter,
             lat: placeData.Lat,
             lon: placeData.Lon
         }
     }

     return {
         next: next
     }
 }
