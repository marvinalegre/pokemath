DROP TABLE IF EXISTS pokemons;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS user_pokemon;
DROP TABLE IF EXISTS questions;

CREATE TABLE pokemons (
    id integer NOT NULL PRIMARY KEY,
    name character varying(40),
    description character varying(250),
    imageurl character varying(80),
    color character varying(7),
    availability character varying(3),
    sprite character varying(120)
);

CREATE TABLE users (
    id integer NOT NULL PRIMARY KEY,
    username character varying(3),
    password character varying(8)
);

CREATE TABLE user_pokemon (
    user_id integer NOT NULL,
    pokemon_id integer NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (pokemon_id) REFERENCES pokemons(id)
);

CREATE TABLE questions (
    user_id integer NOT NULL,
    question character varying(80),
    answer character varying(40),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO pokemons VALUES (1, 'Bulbasaur', 'A strange seed was planted on its back at birth. The plant sprouts and grows with this POKéMON.', 'https://pokemons.pages.dev/sugimori/1.png', '#d1e8dd', 'R', 'https://pokemons.pages.dev/sprites/pm0001_00_00_00_big.png');
INSERT INTO pokemons VALUES (2, 'Ivysaur', 'When the bulb on its back grows large, it appears to lose the ability to stand on its hind legs.', 'https://pokemons.pages.dev/sugimori/2.png', '#bbd4db', 'RE', 'https://pokemons.pages.dev/sprites/pm0002_00_00_00_big.png');
INSERT INTO pokemons VALUES (3, 'Venusaur', 'The plant blooms when it is absorbing solar energy. It stays on the move to seek sunlight.', 'https://pokemons.pages.dev/sugimori/3.png', '#dbd4d8', 'REE', 'https://pokemons.pages.dev/sprites/pm0003_00_00_00_big.png');
INSERT INTO pokemons VALUES (4, 'Charmander', 'Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.', 'https://pokemons.pages.dev/sugimori/4.png', '#f6ddcb', 'R', 'https://pokemons.pages.dev/sprites/pm0004_00_00_00_big.png');
INSERT INTO pokemons VALUES (5, 'Charmeleon', 'When it swings its burning tail, it elevates the temperature to unbearably high levels.', 'https://pokemons.pages.dev/sugimori/5.png', '#f3cbc5', 'RE', 'https://pokemons.pages.dev/sprites/pm0005_00_00_00_big.png');
INSERT INTO pokemons VALUES (6, 'Charizard', 'Spits fire that is hot enough to melt boulders. Known to cause forest fires unintentionally.', 'https://pokemons.pages.dev/sugimori/6.png', '#b8d4da', 'REE', 'https://pokemons.pages.dev/sprites/pm0006_00_00_00_big.png');
INSERT INTO pokemons VALUES (7, 'Squirtle', 'Shoots water at prey while in the water. Withdraws into its shell when in danger.', 'https://pokemons.pages.dev/sugimori/7.png', '#c1d7de', 'R', 'https://pokemons.pages.dev/sprites/pm0007_00_00_00_big.png');
INSERT INTO pokemons VALUES (8, 'Wartortle', 'When tapped, this POKéMON will pull in its head, but its tail will still stick out a little bit.', 'https://pokemons.pages.dev/sugimori/8.png', '#dfe4f0', 'RE', 'https://pokemons.pages.dev/sprites/pm0008_00_00_00_big.png');
INSERT INTO pokemons VALUES (9, 'Blastoise', 'It deliberately makes itself heavy so it can withstand the recoil of the water jets it fires.', 'https://pokemons.pages.dev/sugimori/9.png', '#d1dceb', 'REE', 'https://pokemons.pages.dev/sprites/pm0009_00_00_00_big.png');
INSERT INTO pokemons VALUES (23, 'Ekans', 'Moves silently and stealthily. Eats the eggs of birds, such as PIDGEY and SPEAROW, whole.', 'https://pokemons.pages.dev/sugimori/23.png', '#cfbfcb', 'C', 'https://pokemons.pages.dev/sprites/pm0023_00_00_00_big.png');
INSERT INTO pokemons VALUES (24, 'Arbok', 'It is rumored that the ferocious warning markings on its belly differ from area to area.', 'https://pokemons.pages.dev/sugimori/24.png', '#c7c3c7', 'C', 'https://pokemons.pages.dev/sprites/pm0024_00_00_00_big.png');
INSERT INTO pokemons VALUES (25, 'Pikachu', 'When several of these POKéMON gather, their electricity could build and cause lightning storms.', 'https://pokemons.pages.dev/sugimori/25.png', '#faefca', 'C', 'https://pokemons.pages.dev/sprites/pm0025_00_00_00_big.png');
INSERT INTO pokemons VALUES (26, 'Raichu', 'Its tail discharges electricity into the ground, protecting it from getting shocked.', 'https://pokemons.pages.dev/sugimori/26.png', '#f8e3be', 'C', 'https://pokemons.pages.dev/sprites/pm0026_00_00_00_big.png');
INSERT INTO pokemons VALUES (27, 'Sandshrew', 'Burrows deep underground in arid locations far from water. It only emerges to hunt for food.', 'https://pokemons.pages.dev/sugimori/27.png', '#f5e9c9', 'T', 'https://pokemons.pages.dev/sprites/pm0027_00_00_00_big.png');
INSERT INTO pokemons VALUES (28, 'Sandslash', 'Curls up into a spiny ball when threatened. It can roll while curled up to attack or escape.', 'https://pokemons.pages.dev/sugimori/28.png', '#f3e5c4', 'T', 'https://pokemons.pages.dev/sprites/pm0028_00_00_00_big.png');
INSERT INTO pokemons VALUES (35, 'Clefairy', 'Its magical and cute appeal has many admirers. It is rare and found only in certain areas.', 'https://pokemons.pages.dev/sugimori/35.png', '#fcebed', 'C', 'https://pokemons.pages.dev/sprites/pm0035_00_00_00_big.png');
INSERT INTO pokemons VALUES (36, 'Clefable', 'A timid fairy POKéMON that is rarely seen. It will run and hide the moment it senses people.', 'https://pokemons.pages.dev/sugimori/36.png', '#faefec', 'E', 'https://pokemons.pages.dev/sprites/pm0036_00_00_00_big.png');
INSERT INTO pokemons VALUES (37, 'Vulpix', 'At the time of birth, it has just one tail. The tail splits from its tip as it grows older.', 'https://pokemons.pages.dev/sugimori/37.png', '#e6cfc5', 'T', 'https://pokemons.pages.dev/sprites/pm0037_00_00_00_big.png');
INSERT INTO pokemons VALUES (38, 'Ninetales', 'Very smart and very vengeful. Grabbing one of its many tails could result in a 1000-year curse.', 'https://pokemons.pages.dev/sugimori/38.png', '#f9f4d9', 'T', 'https://pokemons.pages.dev/sprites/pm0038_00_00_00_big.png');
INSERT INTO pokemons VALUES (39, 'Jigglypuff', 'When its huge eyes light up, it sings a mysteriously soothing melody that lulls its enemies to sleep.', 'https://pokemons.pages.dev/sugimori/39.png', '#f9ebee', 'C', 'https://pokemons.pages.dev/sprites/pm0039_00_00_00_big.png');
INSERT INTO pokemons VALUES (40, 'Wigglytuff', 'The body is soft and rubbery. When angered, it will suck in air and inflate itself to an enormous size.', 'https://pokemons.pages.dev/sugimori/40.png', '#faf7fa', 'C', 'https://pokemons.pages.dev/sprites/pm0040_00_00_00_big.png');
INSERT INTO pokemons VALUES (43, 'Oddish', 'During the day, it keeps its face buried in the ground. At night, it wanders around sowing its seeds.', 'https://pokemons.pages.dev/sugimori/43.png', '#b9dbb5', 'C', 'https://pokemons.pages.dev/sprites/pm0043_00_00_00_big.png');
INSERT INTO pokemons VALUES (44, 'Gloom', 'It secretes a sticky, drool-like honey. Although sweet, it smells too repulsive to get very close.', 'https://pokemons.pages.dev/sugimori/44.png', '#e3c1b5', 'C', 'https://pokemons.pages.dev/sprites/pm0044_00_00_00_big.png');
INSERT INTO pokemons VALUES (45, 'Vileplume', 'It has the world''s largest petals. With every step, the petals shake out heavy clouds of toxic pollen.', 'https://pokemons.pages.dev/sugimori/45.png', '#f1d6db', 'E', 'https://pokemons.pages.dev/sprites/pm0045_00_00_00_big.png');
INSERT INTO pokemons VALUES (48, 'Venonat', 'Lives in the shadows of tall trees where it eats insects. It is attracted by light at night.', 'https://pokemons.pages.dev/sugimori/48.png', '#c8c6df', 'C', 'https://pokemons.pages.dev/sprites/pm0048_00_00_00_big.png');
INSERT INTO pokemons VALUES (49, 'Venomoth', 'The dust-like scales covering its wings are color coded to indicate the kinds of poison it has.', 'https://pokemons.pages.dev/sugimori/49.png', '#f4eff7', 'C', 'https://pokemons.pages.dev/sprites/pm0049_00_00_00_big.png');
INSERT INTO pokemons VALUES (50, 'Diglett', 'Lives about one yard underground where it feeds on plant roots. It sometimes appears above ground.', 'https://pokemons.pages.dev/sugimori/50.png', '#ddd1c9', 'C', 'https://pokemons.pages.dev/sprites/pm0050_00_00_00_big.png');
INSERT INTO pokemons VALUES (51, 'Dugtrio', 'A team of DIGLETT triplets. It triggers huge earthquakes by burrowing 60 miles underground.', 'https://pokemons.pages.dev/sugimori/51.png', '#d7cbc5', 'C', 'https://pokemons.pages.dev/sprites/pm0051_00_00_00_big.png');
INSERT INTO pokemons VALUES (52, 'Meowth', 'Adores circular objects. Wanders the streets on a nightly basis to look for dropped loose change.', 'https://pokemons.pages.dev/sugimori/52.png', '#f9f6eb', 'T', 'https://pokemons.pages.dev/sprites/pm0052_00_00_00_big.png');
INSERT INTO pokemons VALUES (53, 'Persian', 'Although its fur has many admirers, it is tough to raise as a pet because of its fickle meanness.', 'https://pokemons.pages.dev/sugimori/53.png', '#f9f1e2', 'T', 'https://pokemons.pages.dev/sprites/pm0053_00_00_00_big.png');
INSERT INTO pokemons VALUES (54, 'Psyduck', 'While lulling its enemies with its vacant look, this wily POKéMON will use psychokinetic powers.', 'https://pokemons.pages.dev/sugimori/54.png', '#f0e2c9', 'C', 'https://pokemons.pages.dev/sprites/pm0054_00_00_00_big.png');
INSERT INTO pokemons VALUES (55, 'Golduck', 'Often seen swimming elegantly by lake shores. It is often mistaken for the Japanese monster, Kappa.', 'https://pokemons.pages.dev/sugimori/55.png', '#cbdeec', 'C', 'https://pokemons.pages.dev/sprites/pm0055_00_00_00_big.png');
INSERT INTO pokemons VALUES (56, 'Mankey', 'Extremely quick to anger. It could be docile one moment then thrashing away the next instant.', 'https://pokemons.pages.dev/sugimori/56.png', '#faf3ee', 'C', 'https://pokemons.pages.dev/sprites/pm0056_00_00_00_big.png');
INSERT INTO pokemons VALUES (57, 'Primeape', 'Always furious and tenacious to boot. It will not abandon chasing its quarry until it is caught.', 'https://pokemons.pages.dev/sugimori/57.png', '#f9f2ec', 'E', 'https://pokemons.pages.dev/sprites/pm0057_00_00_00_big.png');
INSERT INTO pokemons VALUES (58, 'Growlithe', 'Very protective of its territory. It will bark and bite to repel intruders from its space.', 'https://pokemons.pages.dev/sugimori/58.png', '#f8efe3', 'C', 'https://pokemons.pages.dev/sprites/pm0058_00_00_00_big.png');
INSERT INTO pokemons VALUES (59, 'Arcanine', 'A POKéMON that has been admired since the past for its beauty. It runs agilely as if on wings.', 'https://pokemons.pages.dev/sugimori/59.png', '#f9efe4', 'E', 'https://pokemons.pages.dev/sprites/pm0059_00_00_00_big.png');
INSERT INTO pokemons VALUES (60, 'Poliwag', 'Its newly grown legs prevent it from running. It appears to prefer swimming than trying to stand.', 'https://pokemons.pages.dev/sugimori/60.png', '#ccd9e9', 'C', 'https://pokemons.pages.dev/sprites/pm0060_00_00_00_big.png');
INSERT INTO pokemons VALUES (61, 'Poliwhirl', 'Capable of living in or out of water. When out of water, it sweats to keep its body slimy.', 'https://pokemons.pages.dev/sugimori/61.png', '#bccde1', 'C', 'https://pokemons.pages.dev/sprites/pm0061_00_00_00_big.png');
INSERT INTO pokemons VALUES (62, 'Poliwrath', 'An adept swimmer at both the front crawl and breast stroke. Easily overtakes the best human swimmers.', 'https://pokemons.pages.dev/sugimori/62.png', '#bbc7d7', 'E', 'https://pokemons.pages.dev/sprites/pm0062_00_00_00_big.png');
INSERT INTO pokemons VALUES (69, 'Bellsprout', 'Even though its body is extremely skinny, it is blindingly fast when catching its prey.', 'https://pokemons.pages.dev/sugimori/69.png', '#f7f7c5', 'T', 'https://pokemons.pages.dev/sprites/pm0069_00_00_00_big.png');
INSERT INTO pokemons VALUES (70, 'Weepinbell', 'It spits out POISONPOWDER to immobilize the enemy and then finishes it with a spray of ACID.', 'https://pokemons.pages.dev/sugimori/70.png', '#cfe9d2', 'T', 'https://pokemons.pages.dev/sprites/pm0070_00_00_00_big.png');
INSERT INTO pokemons VALUES (71, 'Victreebel', 'Said to live in huge colonies deep in jungles, although no one has ever returned from there.', 'https://pokemons.pages.dev/sugimori/71.png', '#dbedd2', 'T', 'https://pokemons.pages.dev/sprites/pm0071_00_00_00_big.png');
INSERT INTO pokemons VALUES (72, 'Tentacool', 'Drifts in shallow seas. Anglers who hook them by accident are often punished by its stinging acid.', 'https://pokemons.pages.dev/sugimori/72.png', '#9f9f9f', 'C', 'https://pokemons.pages.dev/sprites/pm0072_00_00_00_big.png');
INSERT INTO pokemons VALUES (73, 'Tentacruel', 'The tentacles are normally kept short. On hunts, they are extended to ensnare and immobilize prey.', 'https://pokemons.pages.dev/sugimori/73.png', '#b5daea', 'E', 'https://pokemons.pages.dev/sprites/pm0073_00_00_00_big.png');
INSERT INTO pokemons VALUES (74, 'Geodude', 'Found in fields and mountains. Mistaking them for boulders, people often step or trip on them.', 'https://pokemons.pages.dev/sugimori/74.png', '#e0dfdc', 'C', 'https://pokemons.pages.dev/sprites/pm0074_00_00_00_big.png');
INSERT INTO pokemons VALUES (75, 'Graveler', 'Rolls down slopes to move. It rolls over any obstacle without slowing or changing its direction.', 'https://pokemons.pages.dev/sugimori/75.png', '#e8e8e4', 'C', 'https://pokemons.pages.dev/sprites/pm0075_00_00_00_big.png');
INSERT INTO pokemons VALUES (76, 'Golem', 'Its boulder-like body is extremely hard. It can easily withstand dynamite blasts without damage.', 'https://pokemons.pages.dev/sugimori/76.png', '#bbb9b8', 'TE', 'https://pokemons.pages.dev/sprites/pm0076_00_00_00_big.png');
INSERT INTO pokemons VALUES (79, 'Slowpoke', 'Incredibly slow and dopey. It takes 5 seconds for it to feel pain when under attack.', 'https://pokemons.pages.dev/sugimori/79.png', '#f3dbe2', 'C', 'https://pokemons.pages.dev/sprites/pm0079_00_00_00_big.png');
INSERT INTO pokemons VALUES (80, 'Slowbro', 'The SHELLDER that is latched onto SLOWPOKE''s tail is said to feed on the host''s left over scraps.', 'https://pokemons.pages.dev/sugimori/80.png', '#f2dae1', 'C', 'https://pokemons.pages.dev/sprites/pm0080_00_00_00_big.png');
INSERT INTO pokemons VALUES (81, 'Magnemite', 'Uses anti-gravity to stay suspended. Appears without warning and uses THUNDER WAVE and similar moves.', 'https://pokemons.pages.dev/sugimori/81.png', '#d8e5e9', 'C', 'https://pokemons.pages.dev/sprites/pm0081_00_00_00_big.png');
INSERT INTO pokemons VALUES (82, 'Magneton', 'Formed by several MAGNEMITEs linked together. They frequently appear when sunspots flare up.', 'https://pokemons.pages.dev/sugimori/82.png', '#f0f3f5', 'C', 'https://pokemons.pages.dev/sprites/pm0082_00_00_00_big.png');
INSERT INTO pokemons VALUES (84, 'Doduo', 'A bird that makes up for its poor flying with its fast foot speed. Leaves giant footprints.', 'https://pokemons.pages.dev/sugimori/84.png', '#dbcbc1', 'C', 'https://pokemons.pages.dev/sprites/pm0084_00_00_00_big.png');
INSERT INTO pokemons VALUES (85, 'Dodrio', 'Uses its three brains to execute complex plans. While two heads sleep, one head stays awake.', 'https://pokemons.pages.dev/sugimori/85.png', '#d6c7c1', 'C', 'https://pokemons.pages.dev/sprites/pm0085_00_00_00_big.png');
INSERT INTO pokemons VALUES (86, 'Seel', 'The protruding horn on its head is very hard. It is used for bashing through thick ice.', 'https://pokemons.pages.dev/sugimori/86.png', '#f2f5f9', 'C', 'https://pokemons.pages.dev/sprites/pm0086_00_00_00_big.png');
INSERT INTO pokemons VALUES (87, 'Dewgong', 'Stores thermal energy in its body. Swims at a steady 8 knots even in intensely cold waters.', 'https://pokemons.pages.dev/sugimori/87.png', '#f7f9fb', 'C', 'https://pokemons.pages.dev/sprites/pm0087_00_00_00_big.png');
INSERT INTO pokemons VALUES (88, 'Grimer', 'Appears in filthy areas. Thrives by sucking up polluted sludge that is pumped out of factories.', 'https://pokemons.pages.dev/sugimori/88.png', '#d1c9d4', 'C', 'https://pokemons.pages.dev/sprites/pm0088_00_00_00_big.png');
INSERT INTO pokemons VALUES (89, 'Muk', 'Thickly covered with a filthy, vile sludge. It is so toxic, even its footprints contain poison.', 'https://pokemons.pages.dev/sugimori/89.png', '#dbd5e0', 'C', 'https://pokemons.pages.dev/sprites/pm0089_00_00_00_big.png');
INSERT INTO pokemons VALUES (90, 'Shellder', 'Its hard shell repels any kind of attack. It is vulnerable only when its shell is open.', 'https://pokemons.pages.dev/sugimori/90.png', '#dbdae9', 'C', 'https://pokemons.pages.dev/sprites/pm0090_00_00_00_big.png');
INSERT INTO pokemons VALUES (91, 'Cloyster', 'CLOYSTER that live in seas with harsh tidal currents grow large, sharp spikes on their shells.', 'https://pokemons.pages.dev/sugimori/91.png', '#cdc9d5', 'E', 'https://pokemons.pages.dev/sprites/pm0091_00_00_00_big.png');
INSERT INTO pokemons VALUES (92, 'Gastly', 'Almost invisible, this gaseous POKéMON cloaks the target and puts it to sleep without notice.', 'https://pokemons.pages.dev/sugimori/92.png', '#a19d9e', 'C', 'https://pokemons.pages.dev/sprites/pm0092_00_00_00_big.png');
INSERT INTO pokemons VALUES (93, 'Haunter', 'Because of its ability to slip through block walls, it is said to be from another dimension.', 'https://pokemons.pages.dev/sugimori/93.png', '#c9c5d1', 'C', 'https://pokemons.pages.dev/sprites/pm0093_00_00_00_big.png');
INSERT INTO pokemons VALUES (94, 'Gengar', 'Under a full moon, this POKéMON likes to mimic the shadows of people and laugh at their fright.', 'https://pokemons.pages.dev/sugimori/94.png', '#cbc9da', 'TE', 'https://pokemons.pages.dev/sprites/pm0094_00_00_00_big.png');
INSERT INTO pokemons VALUES (96, 'Drowzee', 'Puts enemies to sleep then eats their dreams. Occasionally gets sick from eating bad dreams.', 'https://pokemons.pages.dev/sugimori/96.png', '#f7e7b6', 'C', 'https://pokemons.pages.dev/sprites/pm0096_00_00_00_big.png');
INSERT INTO pokemons VALUES (97, 'Hypno', 'When it locks eyes with an enemy, it will use a mix of PSI moves such as HYPNOSIS and CONFUSION.', 'https://pokemons.pages.dev/sugimori/97.png', '#fbefba', 'C', 'https://pokemons.pages.dev/sprites/pm0097_00_00_00_big.png');
INSERT INTO pokemons VALUES (100, 'Voltorb', 'Usually found in power plants. Easily mistaken for a POKé BALL, they have zapped many people.', 'https://pokemons.pages.dev/sugimori/100.png', '#f2d1cf', 'C', 'https://pokemons.pages.dev/sprites/pm0100_00_00_00_big.png');
INSERT INTO pokemons VALUES (101, 'Electrode', 'It stores electric energy under very high pressure. It often explodes with little or no provocation.', 'https://pokemons.pages.dev/sugimori/101.png', '#f6f7f8', 'C', 'https://pokemons.pages.dev/sprites/pm0101_00_00_00_big.png');
INSERT INTO pokemons VALUES (102, 'Exeggcute', 'Often mistaken for eggs. When disturbed, they quickly gather and attack in swarms.', 'https://pokemons.pages.dev/sugimori/102.png', '#fcf1f2', 'C', 'https://pokemons.pages.dev/sprites/pm0102_00_00_00_big.png');
INSERT INTO pokemons VALUES (103, 'Exeggutor', 'Legend has it that on rare occasions, one of its heads will drop off and continue on as an EXEGGCUTE.', 'https://pokemons.pages.dev/sugimori/103.png', '#c1dec9', 'E', 'https://pokemons.pages.dev/sprites/pm0103_00_00_00_big.png');
INSERT INTO pokemons VALUES (106, 'Hitmonlee', 'When in a hurry, its legs lengthen progressively. It runs smoothly with extra long, loping strides.', 'https://pokemons.pages.dev/sugimori/106.png', '#dcd4d2', 'R', 'https://pokemons.pages.dev/sprites/pm0106_00_00_00_big.png');
INSERT INTO pokemons VALUES (107, 'Hitmonchan', 'While apparently doing nothing, it fires punches in lightning fast volleys that are impossible to see.', 'https://pokemons.pages.dev/sugimori/107.png', '#e8e2dc', 'R', 'https://pokemons.pages.dev/sprites/pm0107_00_00_00_big.png');
INSERT INTO pokemons VALUES (109, 'Koffing', 'Because it stores several kinds of toxic gases in its body, it is prone to exploding without warning.', 'https://pokemons.pages.dev/sugimori/109.png', '#d9d9eb', 'C', 'https://pokemons.pages.dev/sprites/pm0109_00_00_00_big.png');
INSERT INTO pokemons VALUES (110, 'Weezing', 'Where two kinds of poison gases meet, 2 KOFFINGs can fuse into a WEEZING over many years.', 'https://pokemons.pages.dev/sugimori/110.png', '#cec9cf', 'C', 'https://pokemons.pages.dev/sprites/pm0110_00_00_00_big.png');
INSERT INTO pokemons VALUES (111, 'Rhyhorn', 'Its massive bones are 1000 times harder than human bones. It can easily knock a trailer flying.', 'https://pokemons.pages.dev/sugimori/111.png', '#d5dadd', 'C', 'https://pokemons.pages.dev/sprites/pm0111_00_00_00_big.png');
INSERT INTO pokemons VALUES (112, 'Rhydon', 'Protected by an armor-like hide, it is capable of living in molten lava of 3,600 degrees.', 'https://pokemons.pages.dev/sugimori/112.png', '#d1d3d8', 'C', 'https://pokemons.pages.dev/sprites/pm0112_00_00_00_big.png');
INSERT INTO pokemons VALUES (113, 'Chansey', 'A rare and elusive POKéMON that is said to bring happiness to those who manage to get it.', 'https://pokemons.pages.dev/sugimori/113.png', '#faebf3', 'C', 'https://pokemons.pages.dev/sprites/pm0113_00_00_00_big.png');
INSERT INTO pokemons VALUES (116, 'Horsea', 'Known to shoot down flying bugs with precision blasts of ink from the surface of the water.', 'https://pokemons.pages.dev/sugimori/116.png', '#ceedf7', 'C', 'https://pokemons.pages.dev/sprites/pm0116_00_00_00_big.png');
INSERT INTO pokemons VALUES (117, 'Seadra', 'Capable of swimming backwards by rapidly flapping its wing-like pectoral fins and stout tail.', 'https://pokemons.pages.dev/sugimori/117.png', '#cdedf7', 'C', 'https://pokemons.pages.dev/sprites/pm0117_00_00_00_big.png');
INSERT INTO pokemons VALUES (123, 'Scyther', 'With ninja-like agility and speed, it can create the illusion that there is more than one.', 'https://pokemons.pages.dev/sugimori/123.png', '#d7ecd2', 'C', 'https://pokemons.pages.dev/sprites/pm0123_00_00_00_big.png');
INSERT INTO pokemons VALUES (125, 'Electabuzz', 'Normally found near power plants, they can wander away and cause major blackouts in cities.', 'https://pokemons.pages.dev/sugimori/125.png', '#fdefcd', 'C', 'https://pokemons.pages.dev/sprites/pm0125_00_00_00_big.png');
INSERT INTO pokemons VALUES (126, 'Magmar', 'Its body always burns with an orange glow that enables it to hide perfectly among flames.', 'https://pokemons.pages.dev/sugimori/126.png', '#f7c3b0', 'T', 'https://pokemons.pages.dev/sprites/pm0126_00_00_00_big.png');
INSERT INTO pokemons VALUES (128, 'Tauros', 'When it targets an enemy, it charges furiously while whipping its body with its long tails.', 'https://pokemons.pages.dev/sugimori/128.png', '#efdac5', 'C', 'https://pokemons.pages.dev/sprites/pm0128_00_00_00_big.png');
INSERT INTO pokemons VALUES (129, 'Magikarp', 'In the distant past, it was somewhat stronger than the horribly weak descendants that exist today.', 'https://pokemons.pages.dev/sugimori/129.png', '#f7f7f7', 'C', 'https://pokemons.pages.dev/sprites/pm0129_00_00_00_big.png');
INSERT INTO pokemons VALUES (130, 'Gyarados', 'Rarely seen in the wild. Huge and vicious, it is capable of destroying entire cities in a rage.', 'https://pokemons.pages.dev/sugimori/130.png', '#b0d3e0', 'HE', 'https://pokemons.pages.dev/sprites/pm0130_00_00_00_big.png');
INSERT INTO pokemons VALUES (131, 'Lapras', 'A POKéMON that has been overhunted almost to extinction. It can ferry people across the water.', 'https://pokemons.pages.dev/sugimori/131.png', '#bce1f1', 'R', 'https://pokemons.pages.dev/sprites/pm0131_00_00_00_big.png');
INSERT INTO pokemons VALUES (132, 'Ditto', 'It can freely recombine its own cellular structure to transform into other life-forms.', 'https://pokemons.pages.dev/sugimori/132.png', '#e9e2ef', 'C', 'https://pokemons.pages.dev/sprites/pm0132_00_00_00_big.png');
INSERT INTO pokemons VALUES (133, 'Eevee', 'Its genetic code is irregular. It may mutate if it is exposed to radiation from element STONEs.', 'https://pokemons.pages.dev/sugimori/133.png', '#e5d1bd', 'R', 'https://pokemons.pages.dev/sprites/pm0133_00_00_00_big.png');
INSERT INTO pokemons VALUES (134, 'Vaporeon', 'Lives close to water. Its long tail is ridged with a fin which is often mistaken for a mermaid''s.', 'https://pokemons.pages.dev/sugimori/134.png', '#caebf3', 'RE', 'https://pokemons.pages.dev/sprites/pm0134_00_00_00_big.png');
INSERT INTO pokemons VALUES (135, 'Jolteon', 'It accumulates negative ions in the atmosphere to blast out 10000- volt lightning bolts.', 'https://pokemons.pages.dev/sugimori/135.png', '#fdeec6', 'RE', 'https://pokemons.pages.dev/sprites/pm0135_00_00_00_big.png');
INSERT INTO pokemons VALUES (136, 'Flareon', 'When storing thermal energy in its body, its temperature could soar to over 1600 degrees.', 'https://pokemons.pages.dev/sugimori/136.png', '#f3ebd5', 'RE', 'https://pokemons.pages.dev/sprites/pm0136_00_00_00_big.png');
INSERT INTO pokemons VALUES (137, 'Porygon', 'A POKéMON that consists entirely of programming code. Capable of moving freely in cyberspace.', 'https://pokemons.pages.dev/sugimori/137.png', '#f3bfc4', 'R', 'https://pokemons.pages.dev/sprites/pm0137_00_00_00_big.png');
INSERT INTO pokemons VALUES (143, 'Snorlax', 'Very lazy. Just eats and sleeps. As its rotund bulk builds, it becomes steadily more slothful.', 'https://pokemons.pages.dev/sugimori/143.png', '#f9f4ef', 'HE', 'https://pokemons.pages.dev/sprites/pm0143_00_00_00_big.png');
INSERT INTO pokemons VALUES (144, 'Articuno', 'A legendary bird POKéMON that is said to appear to doomed people who are lost in icy mountains.', 'https://pokemons.pages.dev/sugimori/144.png', '#abbfcf', 'L', 'https://pokemons.pages.dev/sprites/pm0144_00_00_00_big.png');
INSERT INTO pokemons VALUES (145, 'Zapdos', 'A legendary bird POKéMON that is said to appear from clouds while dropping enormous lightning bolts.', 'https://pokemons.pages.dev/sugimori/145.png', '#fff1cc', 'L', 'https://pokemons.pages.dev/sprites/pm0145_00_00_00_big.png');
INSERT INTO pokemons VALUES (146, 'Moltres', 'It is said to be the legendary bird Pokémon of fire. Every flap of its wings creates a dazzling flare of flames.', 'https://pokemons.pages.dev/sugimori/146.png', '#fce8c7', 'L', 'https://pokemons.pages.dev/sprites/pm0146_00_00_00_big.png');
INSERT INTO pokemons VALUES (147, 'Dratini', 'Long considered a mythical POKéMON until recently when a small colony was found living underwater.', 'https://pokemons.pages.dev/sugimori/147.png', '#f8f7f6', 'H', 'https://pokemons.pages.dev/sprites/pm0147_00_00_00_big.png');
INSERT INTO pokemons VALUES (148, 'Dragonair', 'A mystical POKéMON that exudes a gentle aura. Has the ability to change climate conditions.', 'https://pokemons.pages.dev/sugimori/148.png', '#c9dff2', 'HE', 'https://pokemons.pages.dev/sprites/pm0148_00_00_00_big.png');
INSERT INTO pokemons VALUES (149, 'Dragonite', 'An extremely rarely seen marine POKéMON. Its intelligence is said to match that of humans.', 'https://pokemons.pages.dev/sugimori/149.png', '#f9e1c4', 'HEE', 'https://pokemons.pages.dev/sprites/pm0149_00_00_00_big.png');
INSERT INTO pokemons VALUES (150, 'Mewtwo', 'It was created by a scientist after years of horrific gene splicing and DNA engineering experiments.', 'https://pokemons.pages.dev/sugimori/150.png', '#f1eff3', 'L', 'https://pokemons.pages.dev/sprites/pm0150_00_00_00_big.png');
INSERT INTO pokemons VALUES (151, 'Mew', 'So rare that it is still said to be a mirage by many experts. Only a few people have seen it worldwide.', 'https://pokemons.pages.dev/sugimori/151.png', '#f8e7eb', 'L', 'https://pokemons.pages.dev/sprites/pm0151_00_00_00_big.png');

INSERT INTO users VALUES (1, 'marvinalegre', 'fizzbuzz');
INSERT INTO users VALUES (2, 'lucas', 'fizzbuzz');
INSERT INTO users VALUES (3, 'guest', 'secretpassword');

INSERT INTO user_pokemon VALUES (1, 4);
INSERT INTO user_pokemon VALUES (1, 60);
INSERT INTO user_pokemon VALUES (1, 143);
INSERT INTO user_pokemon VALUES (1, 26);
INSERT INTO user_pokemon VALUES (1, 27);
