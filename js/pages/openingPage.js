var genball = genball || {};
genball.pages = genball.pages || {};

genball.pages.openingPage = function(institutionGenerator, homeTeam, awayTeam) {
    return {
        paras: [{
                text: "That was to be the last records room. It needed to be. I needed to promise myself that my old man was as crazy about this as everyone in the department, in the valley and in the man's own family always said he was. Five schools that day alone (<%= otherSchools %> and <%= otherSchool %>) and no mention of a November night that even remotely resembled the stories I had heard over these past 18 years. Mom had always instilled a healthy doubt about his obsession in us and her defeated eye-rolls every time it came up at the dinner table or the sad look she got every time someone asked why he wasn't in charge of the department yet did the rest. But he was our dad and some glimmer in his eye suggested to us on some deep, biological level that he believed he was telling the truth.",
                data: {
                    otherSchools: _(4).times(function(n) {
                        if (n === 0) {
                            return institutionGenerator.next().name
                        }
                        return " " + institutionGenerator.next().name

                    }),
                    otherSchool: institutionGenerator.next().name
                }
            },

            {
                text: 'The SID grabbed a key from a hook under her desk and walked me down into the basement of the athletic building. "Sorry" she said on the way down the stairs, "I\'m a little new on the job and haven\'t really had the chance to familiarize myself with the records from that far back yet. You\'re welcome to look though."',
                data: {}
            }, {
                text: "The basement was stark, institutional cinder block and seemed to stretch on for a mile in either direction. I found the football cabinets easy enough: <%= homeTeamName %> FOOTBALL 1931 in a brass plaque drilled into the top. <%= homeTeamName %> FOOTBALL 1932 though <%= homeTeamName %> FOOTBALL 1995 spun over the next three rows.",
                data: {
                    homeTeamName: homeTeam.name.toUpperCase()
                }
            }, {
                text: "<%= homeTeamName %> FOOTBALL 1996 didn't follow though. The next row skipped straight to '97. I looked around for a few minutes trying to figure out what happened. I was ready to mark it up to an archival slip up when I got the sudden sensation of not being alone in the basement. An apparition appeared at the head of the row.",
                data: {
                    homeTeamName: homeTeam.name.toUpperCase()
                }
            }, {
                text: '"You looking for something stranger?" It was hard to get a clear look at him in the florescent light of the basement. His age was apparent though, from his stoop and the support from the mop he was clearly relying on.',
                data: {}
            }, {
                text: '"What happened to 1996?" I called back.',
                data: {}
            }, {
                text: '"Eh?" he shuffled closer. "You\'ll have to speak up, friend."',
                data: {}
            }, {
                text: 'I waited for him to get within sure earshot. "I asked what happened to the 1996 records. Everything else is here, I can\'t seem to find the \'96 cabinet though."',
                data: {}
            }, {
                text: 'He cast me with a knowing gaze. "I haven\'t had someone ask after those in quite some time, we keep them over here." He started hobbling toward the back of the room.',
                data: {}
            }, {
                text: 'I followed but tried to call after him "Why are the kept separately?"" He huffed out an "Eh? without turning around.',
                data: {}
            }, {
                text: 'We reached a door at the back that had plaque I couldn\'t make out until we got right next to it: <%= homeTeamName %> FOOTBALL 1996. "Here\'s what you\'re looking for pal. What were you yelling about a minute ago?" He put a key in the lock.',
                data: {
                    homeTeamName: homeTeam.name.toUpperCase()
                }
            }, {
                text: '"I asked why \'96 isn\'t with the others."" He opened the door, it was pitch black inside.',
                data: {}
            }, {
                text: '"Well pal", he placed his hand on my shoulder, "it\'s hard to archive records that are still being made." With that, he ushered me though the door with surprisingly strong slap on the back.',
                data: {}
            }, {
                text: '"GO <%= homeTeamName %>" he hollered as I stumbled into the void.',
                data: {
                    homeTeamName: homeTeam.name.toUpperCase()
                }
            }, {
                text: "The black was soon replaced with a football stadium of platonic form. Wheat fields stretched out forever on past the parking lots. The stands were two sets of full bleachers and a half riser in the end zone. It was a very familiar Midwestern November Noon - bright and cold.",
                data: {}

            }, {
                text: "The seats were full. Most people were wearing <%= homeTeamColor %> but a solid block across from me had on <%= awayTeamColor %>. The modest pressbox had <%= stadiumName %> written across it's lower supports. A marching band was exiting the field for what looked to be the opening coin toss.",
                data: {
                    homeTeamColor: homeTeam.color,
                    awayTeamColor: awayTeam.color,
                    stadiumName: homeTeam.stadium.toUpperCase()
                }
            }, {
                text: 'I felt an arm reach around me "Glad you made it champ. We\'re in for a barnburner." It was dad. "Is this the one?" I didn\'t have the slightest inclination to ask where he\'d been or what had happened to me.  "We\'ll find out." He gave me that smile that said he knew.',
                data: {}
            }, {
                text: "A game to end all of \'em. The <%= homeTeamFullName %>  hosting the <%= awayTeamFullName %>.  A game that lasts forever.",
                data: {
                    homeTeamFullName: homeTeam.institution.name + " " + homeTeam.name,
                    awayTeamFullName: awayTeam.institution.name + " " + awayTeam.name,
                }
            }
        ]
    }
}
