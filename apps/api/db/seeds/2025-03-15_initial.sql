PRAGMA defer_foreign_keys=TRUE;
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    jwt_id TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    hashed_password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
INSERT INTO users VALUES(1,'qVrNmwMLuJikjQtqyHKE8','marvinalegre','$2a$10$1C7esBZAEWnzWWK8FAbSsOtYJXgk57BXwt6bt3TZ8N865Fkn0aImS','2024-05-11 12:51:17');
INSERT INTO users VALUES(2,'GQAQ4PZVsM4cYON0MpJ3s','lucas','$2a$10$fF6KKE.lmWJnoWX0IWuKoe74uypKik.sDBhFmPdT1cSL04IFCe6Py','2024-05-11 12:51:17');
DROP TABLE IF EXISTS pokemons;
CREATE TABLE pokemons (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL UNIQUE,
    color TEXT NOT NULL,
    availability TEXT NOT NULL
);
INSERT INTO pokemons VALUES(1,'Bulbasaur','A strange seed was planted on its back at birth. The plant sprouts and grows with this POKéMON.','#d1e8dd','R');
INSERT INTO pokemons VALUES(2,'Ivysaur','When the bulb on its back grows large, it appears to lose the ability to stand on its hind legs.','#bbd4db','RE');
INSERT INTO pokemons VALUES(3,'Venusaur','The plant blooms when it is absorbing solar energy. It stays on the move to seek sunlight.','#dbd4d8','REE');
INSERT INTO pokemons VALUES(4,'Charmander','Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.','#f6ddcb','R');
INSERT INTO pokemons VALUES(5,'Charmeleon','When it swings its burning tail, it elevates the temperature to unbearably high levels.','#f3cbc5','RE');
INSERT INTO pokemons VALUES(6,'Charizard','Spits fire that is hot enough to melt boulders. Known to cause forest fires unintentionally.','#b8d4da','REE');
INSERT INTO pokemons VALUES(7,'Squirtle','Shoots water at prey while in the water. Withdraws into its shell when in danger.','#c1d7de','R');
INSERT INTO pokemons VALUES(8,'Wartortle','When tapped, this POKéMON will pull in its head, but its tail will still stick out a little bit.','#dfe4f0','RE');
INSERT INTO pokemons VALUES(9,'Blastoise','It deliberately makes itself heavy so it can withstand the recoil of the water jets it fires.','#d1dceb','REE');
INSERT INTO pokemons VALUES(23,'Ekans','Moves silently and stealthily. Eats the eggs of birds, such as PIDGEY and SPEAROW, whole.','#cfbfcb','C');
INSERT INTO pokemons VALUES(24,'Arbok','It is rumored that the ferocious warning markings on its belly differ from area to area.','#c7c3c7','C');
INSERT INTO pokemons VALUES(25,'Pikachu','When several of these POKéMON gather, their electricity could build and cause lightning storms.','#faefca','C');
INSERT INTO pokemons VALUES(26,'Raichu','Its tail discharges electricity into the ground, protecting it from getting shocked.','#f8e3be','C');
INSERT INTO pokemons VALUES(27,'Sandshrew','Burrows deep underground in arid locations far from water. It only emerges to hunt for food.','#f5e9c9','T');
INSERT INTO pokemons VALUES(28,'Sandslash','Curls up into a spiny ball when threatened. It can roll while curled up to attack or escape.','#f3e5c4','TE');
INSERT INTO pokemons VALUES(35,'Clefairy','Its magical and cute appeal has many admirers. It is rare and found only in certain areas.','#fcebed','C');
INSERT INTO pokemons VALUES(36,'Clefable','A timid fairy POKéMON that is rarely seen. It will run and hide the moment it senses people.','#faefec','E');
INSERT INTO pokemons VALUES(37,'Vulpix','At the time of birth, it has just one tail. The tail splits from its tip as it grows older.','#e6cfc5','T');
INSERT INTO pokemons VALUES(38,'Ninetales','Very smart and very vengeful. Grabbing one of its many tails could result in a 1000-year curse.','#f9f4d9','TE');
INSERT INTO pokemons VALUES(39,'Jigglypuff','When its huge eyes light up, it sings a mysteriously soothing melody that lulls its enemies to sleep.','#f9ebee','C');
INSERT INTO pokemons VALUES(40,'Wigglytuff','The body is soft and rubbery. When angered, it will suck in air and inflate itself to an enormous size.','#faf7fa','C');
INSERT INTO pokemons VALUES(43,'Oddish','During the day, it keeps its face buried in the ground. At night, it wanders around sowing its seeds.','#b9dbb5','C');
INSERT INTO pokemons VALUES(44,'Gloom','It secretes a sticky, drool-like honey. Although sweet, it smells too repulsive to get very close.','#e3c1b5','C');
INSERT INTO pokemons VALUES(45,'Vileplume','It has the world''s largest petals. With every step, the petals shake out heavy clouds of toxic pollen.','#f1d6db','E');
INSERT INTO pokemons VALUES(48,'Venonat','Lives in the shadows of tall trees where it eats insects. It is attracted by light at night.','#c8c6df','C');
INSERT INTO pokemons VALUES(49,'Venomoth','The dust-like scales covering its wings are color coded to indicate the kinds of poison it has.','#f4eff7','C');
INSERT INTO pokemons VALUES(50,'Diglett','Lives about one yard underground where it feeds on plant roots. It sometimes appears above ground.','#ddd1c9','C');
INSERT INTO pokemons VALUES(51,'Dugtrio','A team of DIGLETT triplets. It triggers huge earthquakes by burrowing 60 miles underground.','#d7cbc5','C');
INSERT INTO pokemons VALUES(52,'Meowth','Adores circular objects. Wanders the streets on a nightly basis to look for dropped loose change.','#f9f6eb','T');
INSERT INTO pokemons VALUES(53,'Persian','Although its fur has many admirers, it is tough to raise as a pet because of its fickle meanness.','#f9f1e2','TE');
INSERT INTO pokemons VALUES(54,'Psyduck','While lulling its enemies with its vacant look, this wily POKéMON will use psychokinetic powers.','#f0e2c9','C');
INSERT INTO pokemons VALUES(55,'Golduck','Often seen swimming elegantly by lake shores. It is often mistaken for the Japanese monster, Kappa.','#cbdeec','C');
INSERT INTO pokemons VALUES(56,'Mankey','Extremely quick to anger. It could be docile one moment then thrashing away the next instant.','#faf3ee','C');
INSERT INTO pokemons VALUES(57,'Primeape','Always furious and tenacious to boot. It will not abandon chasing its quarry until it is caught.','#f9f2ec','E');
INSERT INTO pokemons VALUES(58,'Growlithe','Very protective of its territory. It will bark and bite to repel intruders from its space.','#f8efe3','C');
INSERT INTO pokemons VALUES(59,'Arcanine','A POKéMON that has been admired since the past for its beauty. It runs agilely as if on wings.','#f9efe4','E');
INSERT INTO pokemons VALUES(60,'Poliwag','Its newly grown legs prevent it from running. It appears to prefer swimming than trying to stand.','#ccd9e9','C');
INSERT INTO pokemons VALUES(61,'Poliwhirl','Capable of living in or out of water. When out of water, it sweats to keep its body slimy.','#bccde1','C');
INSERT INTO pokemons VALUES(62,'Poliwrath','An adept swimmer at both the front crawl and breast stroke. Easily overtakes the best human swimmers.','#bbc7d7','E');
INSERT INTO pokemons VALUES(69,'Bellsprout','Even though its body is extremely skinny, it is blindingly fast when catching its prey.','#f7f7c5','T');
INSERT INTO pokemons VALUES(70,'Weepinbell','It spits out POISONPOWDER to immobilize the enemy and then finishes it with a spray of ACID.','#cfe9d2','TE');
INSERT INTO pokemons VALUES(71,'Victreebel','Said to live in huge colonies deep in jungles, although no one has ever returned from there.','#dbedd2','TEE');
INSERT INTO pokemons VALUES(72,'Tentacool','Drifts in shallow seas. Anglers who hook them by accident are often punished by its stinging acid.','#9f9f9f','C');
INSERT INTO pokemons VALUES(73,'Tentacruel','The tentacles are normally kept short. On hunts, they are extended to ensnare and immobilize prey.','#b5daea','E');
INSERT INTO pokemons VALUES(74,'Geodude','Found in fields and mountains. Mistaking them for boulders, people often step or trip on them.','#e0dfdc','C');
INSERT INTO pokemons VALUES(75,'Graveler','Rolls down slopes to move. It rolls over any obstacle without slowing or changing its direction.','#e8e8e4','C');
INSERT INTO pokemons VALUES(76,'Golem','Its boulder-like body is extremely hard. It can easily withstand dynamite blasts without damage.','#bbb9b8','TEE');
INSERT INTO pokemons VALUES(79,'Slowpoke','Incredibly slow and dopey. It takes 5 seconds for it to feel pain when under attack.','#f3dbe2','C');
INSERT INTO pokemons VALUES(80,'Slowbro','The SHELLDER that is latched onto SLOWPOKE''s tail is said to feed on the host''s left over scraps.','#f2dae1','C');
INSERT INTO pokemons VALUES(81,'Magnemite','Uses anti-gravity to stay suspended. Appears without warning and uses THUNDER WAVE and similar moves.','#d8e5e9','C');
INSERT INTO pokemons VALUES(82,'Magneton','Formed by several MAGNEMITEs linked together. They frequently appear when sunspots flare up.','#f0f3f5','C');
INSERT INTO pokemons VALUES(84,'Doduo','A bird that makes up for its poor flying with its fast foot speed. Leaves giant footprints.','#dbcbc1','C');
INSERT INTO pokemons VALUES(85,'Dodrio','Uses its three brains to execute complex plans. While two heads sleep, one head stays awake.','#d6c7c1','C');
INSERT INTO pokemons VALUES(86,'Seel','The protruding horn on its head is very hard. It is used for bashing through thick ice.','#f2f5f9','C');
INSERT INTO pokemons VALUES(87,'Dewgong','Stores thermal energy in its body. Swims at a steady 8 knots even in intensely cold waters.','#f7f9fb','C');
INSERT INTO pokemons VALUES(88,'Grimer','Appears in filthy areas. Thrives by sucking up polluted sludge that is pumped out of factories.','#d1c9d4','C');
INSERT INTO pokemons VALUES(89,'Muk','Thickly covered with a filthy, vile sludge. It is so toxic, even its footprints contain poison.','#dbd5e0','C');
INSERT INTO pokemons VALUES(90,'Shellder','Its hard shell repels any kind of attack. It is vulnerable only when its shell is open.','#dbdae9','C');
INSERT INTO pokemons VALUES(91,'Cloyster','CLOYSTER that live in seas with harsh tidal currents grow large, sharp spikes on their shells.','#cdc9d5','E');
INSERT INTO pokemons VALUES(92,'Gastly','Almost invisible, this gaseous POKéMON cloaks the target and puts it to sleep without notice.','#a19d9e','C');
INSERT INTO pokemons VALUES(93,'Haunter','Because of its ability to slip through block walls, it is said to be from another dimension.','#c9c5d1','E');
INSERT INTO pokemons VALUES(94,'Gengar','Under a full moon, this POKéMON likes to mimic the shadows of people and laugh at their fright.','#cbc9da','TEE');
INSERT INTO pokemons VALUES(96,'Drowzee','Puts enemies to sleep then eats their dreams. Occasionally gets sick from eating bad dreams.','#f7e7b6','C');
INSERT INTO pokemons VALUES(97,'Hypno','When it locks eyes with an enemy, it will use a mix of PSI moves such as HYPNOSIS and CONFUSION.','#fbefba','C');
INSERT INTO pokemons VALUES(100,'Voltorb','Usually found in power plants. Easily mistaken for a POKé BALL, they have zapped many people.','#f2d1cf','C');
INSERT INTO pokemons VALUES(101,'Electrode','It stores electric energy under very high pressure. It often explodes with little or no provocation.','#f6f7f8','C');
INSERT INTO pokemons VALUES(102,'Exeggcute','Often mistaken for eggs. When disturbed, they quickly gather and attack in swarms.','#fcf1f2','C');
INSERT INTO pokemons VALUES(103,'Exeggutor','Legend has it that on rare occasions, one of its heads will drop off and continue on as an EXEGGCUTE.','#c1dec9','E');
INSERT INTO pokemons VALUES(106,'Hitmonlee','When in a hurry, its legs lengthen progressively. It runs smoothly with extra long, loping strides.','#dcd4d2','R');
INSERT INTO pokemons VALUES(107,'Hitmonchan','While apparently doing nothing, it fires punches in lightning fast volleys that are impossible to see.','#e8e2dc','R');
INSERT INTO pokemons VALUES(109,'Koffing','Because it stores several kinds of toxic gases in its body, it is prone to exploding without warning.','#d9d9eb','C');
INSERT INTO pokemons VALUES(110,'Weezing','Where two kinds of poison gases meet, 2 KOFFINGs can fuse into a WEEZING over many years.','#cec9cf','C');
INSERT INTO pokemons VALUES(111,'Rhyhorn','Its massive bones are 1000 times harder than human bones. It can easily knock a trailer flying.','#d5dadd','C');
INSERT INTO pokemons VALUES(112,'Rhydon','Protected by an armor-like hide, it is capable of living in molten lava of 3,600 degrees.','#d1d3d8','C');
INSERT INTO pokemons VALUES(113,'Chansey','A rare and elusive POKéMON that is said to bring happiness to those who manage to get it.','#faebf3','C');
INSERT INTO pokemons VALUES(116,'Horsea','Known to shoot down flying bugs with precision blasts of ink from the surface of the water.','#ceedf7','C');
INSERT INTO pokemons VALUES(117,'Seadra','Capable of swimming backwards by rapidly flapping its wing-like pectoral fins and stout tail.','#cdedf7','C');
INSERT INTO pokemons VALUES(123,'Scyther','With ninja-like agility and speed, it can create the illusion that there is more than one.','#d7ecd2','C');
INSERT INTO pokemons VALUES(125,'Electabuzz','Normally found near power plants, they can wander away and cause major blackouts in cities.','#fdefcd','C');
INSERT INTO pokemons VALUES(126,'Magmar','Its body always burns with an orange glow that enables it to hide perfectly among flames.','#f7c3b0','TE');
INSERT INTO pokemons VALUES(128,'Tauros','When it targets an enemy, it charges furiously while whipping its body with its long tails.','#efdac5','C');
INSERT INTO pokemons VALUES(129,'Magikarp','In the distant past, it was somewhat stronger than the horribly weak descendants that exist today.','#f7f7f7','C');
INSERT INTO pokemons VALUES(130,'Gyarados','Rarely seen in the wild. Huge and vicious, it is capable of destroying entire cities in a rage.','#b0d3e0','H');
INSERT INTO pokemons VALUES(131,'Lapras','A POKéMON that has been overhunted almost to extinction. It can ferry people across the water.','#bce1f1','R');
INSERT INTO pokemons VALUES(132,'Ditto','It can freely recombine its own cellular structure to transform into other life-forms.','#e9e2ef','C');
INSERT INTO pokemons VALUES(133,'Eevee','Its genetic code is irregular. It may mutate if it is exposed to radiation from element STONEs.','#e5d1bd','R');
INSERT INTO pokemons VALUES(134,'Vaporeon','Lives close to water. Its long tail is ridged with a fin which is often mistaken for a mermaid''s.','#caebf3','RE');
INSERT INTO pokemons VALUES(135,'Jolteon','It accumulates negative ions in the atmosphere to blast out 10000- volt lightning bolts.','#fdeec6','RE');
INSERT INTO pokemons VALUES(136,'Flareon','When storing thermal energy in its body, its temperature could soar to over 1600 degrees.','#f3ebd5','RE');
INSERT INTO pokemons VALUES(137,'Porygon','A POKéMON that consists entirely of programming code. Capable of moving freely in cyberspace.','#f3bfc4','R');
INSERT INTO pokemons VALUES(143,'Snorlax','Very lazy. Just eats and sleeps. As its rotund bulk builds, it becomes steadily more slothful.','#f9f4ef','H');
INSERT INTO pokemons VALUES(144,'Articuno','A legendary bird POKéMON that is said to appear to doomed people who are lost in icy mountains.','#abbfcf','L');
INSERT INTO pokemons VALUES(145,'Zapdos','A legendary bird POKéMON that is said to appear from clouds while dropping enormous lightning bolts.','#fff1cc','L');
INSERT INTO pokemons VALUES(146,'Moltres','It is said to be the legendary bird Pokémon of fire. Every flap of its wings creates a dazzling flare of flames.','#fce8c7','L');
INSERT INTO pokemons VALUES(147,'Dratini','Long considered a mythical POKéMON until recently when a small colony was found living underwater.','#f8f7f6','H');
INSERT INTO pokemons VALUES(148,'Dragonair','A mystical POKéMON that exudes a gentle aura. Has the ability to change climate conditions.','#c9dff2','HE');
INSERT INTO pokemons VALUES(149,'Dragonite','An extremely rarely seen marine POKéMON. Its intelligence is said to match that of humans.','#f9e1c4','HEE');
INSERT INTO pokemons VALUES(150,'Mewtwo','It was created by a scientist after years of horrific gene splicing and DNA engineering experiments.','#f1eff3','L');
INSERT INTO pokemons VALUES(151,'Mew','So rare that it is still said to be a mirage by many experts. Only a few people have seen it worldwide.','#f8e7eb','L');
DROP TABLE IF EXISTS types;
CREATE TABLE types (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);
INSERT INTO types VALUES(1,'normal');
INSERT INTO types VALUES(2,'fighting');
INSERT INTO types VALUES(3,'flying');
INSERT INTO types VALUES(4,'poison');
INSERT INTO types VALUES(5,'ground');
INSERT INTO types VALUES(6,'rock');
INSERT INTO types VALUES(7,'bug');
INSERT INTO types VALUES(8,'ghost');
INSERT INTO types VALUES(9,'steel');
INSERT INTO types VALUES(10,'fire');
INSERT INTO types VALUES(11,'water');
INSERT INTO types VALUES(12,'grass');
INSERT INTO types VALUES(13,'electric');
INSERT INTO types VALUES(14,'psychic');
INSERT INTO types VALUES(15,'ice');
INSERT INTO types VALUES(16,'dragon');
INSERT INTO types VALUES(17,'dark');
INSERT INTO types VALUES(18,'fairy');
DROP TABLE IF EXISTS user_questions;
CREATE TABLE user_questions (
    user_id INTEGER NOT NULL UNIQUE,
    question_code TEXT NOT NULL,
    question_parameters TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
INSERT INTO user_questions VALUES(1,'c','2','2','2025-01-20 04:41:43');
INSERT INTO user_questions VALUES(2,'c','19','19','2025-03-13 08:39:28');
DROP TABLE IF EXISTS user_pokemons;
CREATE TABLE user_pokemons (
    id INTEGER PRIMARY KEY,
    user_pokemon_ext_id TEXT NOT NULL UNIQUE,
    user_id INTEGER NOT NULL,
    pokemon_id INTEGER NOT NULL,
    caught_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    pinned INTEGER DEFAULT 0 NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (pokemon_id) REFERENCES pokemons(id)
);
INSERT INTO user_pokemons VALUES(1,'ua_idpo15fM2iNQnF8wQE',2,133,'2024-05-11 12:51:17',0);
INSERT INTO user_pokemons VALUES(2,'tZcF7jMBmTH7A_cNTimUU',2,53,'2024-05-11 12:51:17',0);
INSERT INTO user_pokemons VALUES(3,'lPis7D-7wu0UO02rzQwyT',2,1,'2024-05-11 12:51:17',0);
INSERT INTO user_pokemons VALUES(4,'D97JwL6xt6_wd9L2oOqlP',2,131,'2024-05-11 12:51:17',0);
INSERT INTO user_pokemons VALUES(5,'lvWljMUP7DmYRmj0s_Umv',2,126,'2024-05-11 12:51:17',0);
INSERT INTO user_pokemons VALUES(6,'Mq7YuHzivgO54Lf7pPLq_',2,148,'2024-05-11 12:51:17',0);
INSERT INTO user_pokemons VALUES(7,'Bfpv8orTrqUNrX4H9NMSs',2,70,'2024-05-11 12:51:17',0);
INSERT INTO user_pokemons VALUES(8,'HrxstZFB4v7ixaJfOABF9',1,106,'2024-05-11 12:51:41',0);
INSERT INTO user_pokemons VALUES(9,'SkAorbRL88E2Tt1A1ALKZ',1,52,'2024-05-11 12:51:41',0);
INSERT INTO user_pokemons VALUES(10,'yyKfYLv_NtInf3O69iq0O',1,70,'2024-05-11 12:51:41',0);
INSERT INTO user_pokemons VALUES(11,'Q3-1rCkRTQvdhvLZ3Hthz',1,107,'2024-05-11 12:51:41',0);
INSERT INTO user_pokemons VALUES(12,'3dRceUMjGVsK5v8DM_7fF',1,8,'2024-05-11 12:51:41',0);
INSERT INTO user_pokemons VALUES(13,'F1H1iY0q5vIBh51M3gO7P',1,147,'2024-05-11 12:51:41',0);
INSERT INTO user_pokemons VALUES(14,'t6_QNhlEcdkCUtm8TbPHa',1,126,'2024-05-11 12:51:41',0);
INSERT INTO user_pokemons VALUES(859,'pwCu1lt6_4Latmcjasm7D',2,93,'2025-02-10 09:35:21',0);
INSERT INTO user_pokemons VALUES(860,'rQBIe3GZy1llzIJf8Xgf0',2,75,'2025-02-10 09:36:15',0);
INSERT INTO user_pokemons VALUES(861,'xmXAulvQkNZm9at5eypOD',2,103,'2025-02-27 09:51:44',0);
INSERT INTO user_pokemons VALUES(864,'AoDFv-F1zFfRdYtQhAVyG',2,129,'2025-03-13 08:00:37',0);
INSERT INTO user_pokemons VALUES(865,'zdQydXyTDKFWW2VnQ0EHa',2,93,'2025-03-13 08:02:37',0);
INSERT INTO user_pokemons VALUES(866,'gsKSgHRZLfI-GnmLgVf6O',2,74,'2025-03-13 08:02:50',0);
INSERT INTO user_pokemons VALUES(867,'eopHqGVKakIODea_iqvoR',2,87,'2025-03-13 08:05:27',0);
INSERT INTO user_pokemons VALUES(868,'1d-hEITk4-3c8E0xjQkFR',2,51,'2025-03-13 08:05:37',0);
INSERT INTO user_pokemons VALUES(869,'0ZAyvexrV5Ww_QhsBGc-m',2,60,'2025-03-13 08:05:43',0);
INSERT INTO user_pokemons VALUES(870,'018H9ZDFfWCZO3j2rtRGz',2,75,'2025-03-13 08:12:10',0);
INSERT INTO user_pokemons VALUES(871,'psJ5oGlXn1YEekgXxJT3N',2,74,'2025-03-13 08:13:21',0);
INSERT INTO user_pokemons VALUES(872,'0NmAVCk5kfI2-YOsUlMv8',2,92,'2025-03-13 08:20:06',0);
INSERT INTO user_pokemons VALUES(873,'ON-v6b0OfvbWTCYQ1975V',2,75,'2025-03-13 08:26:48',0);
INSERT INTO user_pokemons VALUES(874,'GSHx8bq16vc7uuK89Mzz2',2,74,'2025-03-13 08:30:03',0);
DROP TABLE IF EXISTS pokemon_types;
CREATE TABLE pokemon_types (
    pokemon_id INTEGER NOT NULL,
    type_id INTEGER NOT NULL,
    FOREIGN KEY (pokemon_id) REFERENCES pokemons(id),
    FOREIGN KEY (type_id) REFERENCES types(id)
);
INSERT INTO pokemon_types VALUES(1,12);
INSERT INTO pokemon_types VALUES(1,4);
INSERT INTO pokemon_types VALUES(2,12);
INSERT INTO pokemon_types VALUES(2,4);
INSERT INTO pokemon_types VALUES(3,12);
INSERT INTO pokemon_types VALUES(3,4);
INSERT INTO pokemon_types VALUES(4,10);
INSERT INTO pokemon_types VALUES(5,10);
INSERT INTO pokemon_types VALUES(6,10);
INSERT INTO pokemon_types VALUES(6,3);
INSERT INTO pokemon_types VALUES(7,11);
INSERT INTO pokemon_types VALUES(8,11);
INSERT INTO pokemon_types VALUES(9,11);
INSERT INTO pokemon_types VALUES(23,4);
INSERT INTO pokemon_types VALUES(24,4);
INSERT INTO pokemon_types VALUES(25,13);
INSERT INTO pokemon_types VALUES(26,13);
INSERT INTO pokemon_types VALUES(27,5);
INSERT INTO pokemon_types VALUES(28,5);
INSERT INTO pokemon_types VALUES(35,18);
INSERT INTO pokemon_types VALUES(36,18);
INSERT INTO pokemon_types VALUES(37,10);
INSERT INTO pokemon_types VALUES(38,10);
INSERT INTO pokemon_types VALUES(39,1);
INSERT INTO pokemon_types VALUES(39,18);
INSERT INTO pokemon_types VALUES(40,1);
INSERT INTO pokemon_types VALUES(40,18);
INSERT INTO pokemon_types VALUES(43,12);
INSERT INTO pokemon_types VALUES(43,4);
INSERT INTO pokemon_types VALUES(44,12);
INSERT INTO pokemon_types VALUES(44,4);
INSERT INTO pokemon_types VALUES(45,12);
INSERT INTO pokemon_types VALUES(45,4);
INSERT INTO pokemon_types VALUES(48,7);
INSERT INTO pokemon_types VALUES(48,4);
INSERT INTO pokemon_types VALUES(49,7);
INSERT INTO pokemon_types VALUES(49,4);
INSERT INTO pokemon_types VALUES(50,5);
INSERT INTO pokemon_types VALUES(51,5);
INSERT INTO pokemon_types VALUES(52,1);
INSERT INTO pokemon_types VALUES(53,1);
INSERT INTO pokemon_types VALUES(54,11);
INSERT INTO pokemon_types VALUES(55,11);
INSERT INTO pokemon_types VALUES(56,2);
INSERT INTO pokemon_types VALUES(57,2);
INSERT INTO pokemon_types VALUES(58,10);
INSERT INTO pokemon_types VALUES(59,10);
INSERT INTO pokemon_types VALUES(60,11);
INSERT INTO pokemon_types VALUES(61,11);
INSERT INTO pokemon_types VALUES(62,11);
INSERT INTO pokemon_types VALUES(62,2);
INSERT INTO pokemon_types VALUES(69,12);
INSERT INTO pokemon_types VALUES(69,4);
INSERT INTO pokemon_types VALUES(70,12);
INSERT INTO pokemon_types VALUES(70,4);
INSERT INTO pokemon_types VALUES(71,12);
INSERT INTO pokemon_types VALUES(71,4);
INSERT INTO pokemon_types VALUES(72,11);
INSERT INTO pokemon_types VALUES(72,4);
INSERT INTO pokemon_types VALUES(73,11);
INSERT INTO pokemon_types VALUES(73,4);
INSERT INTO pokemon_types VALUES(74,6);
INSERT INTO pokemon_types VALUES(74,5);
INSERT INTO pokemon_types VALUES(75,6);
INSERT INTO pokemon_types VALUES(75,5);
INSERT INTO pokemon_types VALUES(76,6);
INSERT INTO pokemon_types VALUES(76,5);
INSERT INTO pokemon_types VALUES(79,11);
INSERT INTO pokemon_types VALUES(79,14);
INSERT INTO pokemon_types VALUES(80,11);
INSERT INTO pokemon_types VALUES(80,14);
INSERT INTO pokemon_types VALUES(81,13);
INSERT INTO pokemon_types VALUES(81,9);
INSERT INTO pokemon_types VALUES(82,13);
INSERT INTO pokemon_types VALUES(82,9);
INSERT INTO pokemon_types VALUES(84,1);
INSERT INTO pokemon_types VALUES(84,3);
INSERT INTO pokemon_types VALUES(85,1);
INSERT INTO pokemon_types VALUES(85,3);
INSERT INTO pokemon_types VALUES(86,11);
INSERT INTO pokemon_types VALUES(87,11);
INSERT INTO pokemon_types VALUES(87,15);
INSERT INTO pokemon_types VALUES(88,4);
INSERT INTO pokemon_types VALUES(89,4);
INSERT INTO pokemon_types VALUES(90,11);
INSERT INTO pokemon_types VALUES(91,11);
INSERT INTO pokemon_types VALUES(91,15);
INSERT INTO pokemon_types VALUES(92,8);
INSERT INTO pokemon_types VALUES(92,4);
INSERT INTO pokemon_types VALUES(93,8);
INSERT INTO pokemon_types VALUES(93,4);
INSERT INTO pokemon_types VALUES(94,8);
INSERT INTO pokemon_types VALUES(94,4);
INSERT INTO pokemon_types VALUES(96,14);
INSERT INTO pokemon_types VALUES(97,14);
INSERT INTO pokemon_types VALUES(100,13);
INSERT INTO pokemon_types VALUES(101,13);
INSERT INTO pokemon_types VALUES(102,12);
INSERT INTO pokemon_types VALUES(102,14);
INSERT INTO pokemon_types VALUES(103,12);
INSERT INTO pokemon_types VALUES(103,14);
INSERT INTO pokemon_types VALUES(106,2);
INSERT INTO pokemon_types VALUES(107,2);
INSERT INTO pokemon_types VALUES(109,4);
INSERT INTO pokemon_types VALUES(110,4);
INSERT INTO pokemon_types VALUES(111,5);
INSERT INTO pokemon_types VALUES(111,6);
INSERT INTO pokemon_types VALUES(112,5);
INSERT INTO pokemon_types VALUES(112,6);
INSERT INTO pokemon_types VALUES(113,1);
INSERT INTO pokemon_types VALUES(116,11);
INSERT INTO pokemon_types VALUES(117,11);
INSERT INTO pokemon_types VALUES(123,7);
INSERT INTO pokemon_types VALUES(123,3);
INSERT INTO pokemon_types VALUES(125,13);
INSERT INTO pokemon_types VALUES(126,10);
INSERT INTO pokemon_types VALUES(128,1);
INSERT INTO pokemon_types VALUES(129,11);
INSERT INTO pokemon_types VALUES(130,11);
INSERT INTO pokemon_types VALUES(130,3);
INSERT INTO pokemon_types VALUES(131,11);
INSERT INTO pokemon_types VALUES(131,15);
INSERT INTO pokemon_types VALUES(132,1);
INSERT INTO pokemon_types VALUES(133,1);
INSERT INTO pokemon_types VALUES(134,11);
INSERT INTO pokemon_types VALUES(135,13);
INSERT INTO pokemon_types VALUES(136,10);
INSERT INTO pokemon_types VALUES(137,1);
INSERT INTO pokemon_types VALUES(143,1);
INSERT INTO pokemon_types VALUES(144,15);
INSERT INTO pokemon_types VALUES(144,3);
INSERT INTO pokemon_types VALUES(145,13);
INSERT INTO pokemon_types VALUES(145,3);
INSERT INTO pokemon_types VALUES(146,10);
INSERT INTO pokemon_types VALUES(146,3);
INSERT INTO pokemon_types VALUES(147,16);
INSERT INTO pokemon_types VALUES(148,16);
INSERT INTO pokemon_types VALUES(149,16);
INSERT INTO pokemon_types VALUES(149,3);
INSERT INTO pokemon_types VALUES(150,14);
INSERT INTO pokemon_types VALUES(151,14);
