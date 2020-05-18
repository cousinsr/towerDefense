// Level enemy compositions:

// Set composition of each wave for Level 01
var w1 = ["clothedSkeleton"];
var w2 = ["clothedSkeleton", "clothedSkeleton", "robedSkeleton"];
var w3 = ["clothedSkeleton", "robedSkeleton", "robedSkeleton"];
var w4 = ["clothedSkeleton", "robedSkeleton", "armoredSkeleton"];
var w5 = ["clothedSkeleton", "clothedSkeleton", "armoredSkeleton"];
var w6 = ["robedSkeleton", "armoredSkeleton"];
var w7 = ["robedSkeleton", "armoredSkeleton"];
var w8 = ["clothedSkeleton", "robedSkeleton", "armoredSkeleton"];
var w9 = ["clothedSkeleton", "robedSkeleton", "armoredSkeleton"];
var w10 = ["clothedSkeleton", "robedSkeleton", "armoredSkeleton"];
var enemies01 = [w1, w2, w3, w4, w5, w6, w7, w8, w9, w10];

// Set composition of each wave for Level 02
w1 = ["clothedSkeleton"];
w2 = ["clothedSkeleton", "clothedSkeleton", "robedSkeleton"];
w3 = ["clothedSkeleton", "robedSkeleton", "robedSkeleton"];
w4 = ["clothedSkeleton", "robedSkeleton", "armoredSkeleton"];
w5 = ["clothedSkeleton", "clothedSkeleton", "armoredSkeleton"];
w6 = ["robedSkeleton", "armoredSkeleton"];
w7 = ["robedSkeleton", "armoredSkeleton"];
w8 = ["clothedSkeleton", "robedSkeleton", "robedSkeleton"];
w9 = ["clothedSkeleton", "robedSkeleton", "armoredSkeleton"];
w10 = ["clothedSkeleton", "robedSkeleton", "armoredSkeleton"];
var enemies02 = [w1, w2, w3, w4, w5, w6, w7, w8, w9, w10];

// Set composition of each wave for Level 03
w1 = ["clothedSkeleton"];
w2 = ["clothedSkeleton", "clothedSkeleton", "robedSkeleton"];
w3 = ["clothedSkeleton", "robedSkeleton", "robedSkeleton"];
w4 = ["clothedSkeleton", "robedSkeleton", "armoredSkeleton"];
w5 = ["clothedSkeleton", "clothedSkeleton", "armoredSkeleton"];
w6 = ["robedSkeleton", "armoredSkeleton"];
w7 = ["robedSkeleton", "armoredSkeleton"];
w8 = ["clothedSkeleton", "robedSkeleton", "armoredSkeleton"];
w9 = ["clothedSkeleton", "robedSkeleton", "armoredSkeleton"];
w10 = ["clothedSkeleton", "robedSkeleton", "armoredSkeleton"];
var enemies03 = [w1, w2, w3, w4, w5, w6, w7, w8, w9, w10];

// Set composition of each wave for Level 04
w1 = ["clothedSkeleton"];
w2 = ["clothedSkeleton", "clothedSkeleton", "robedSkeleton"];
w3 = ["clothedSkeleton", "robedSkeleton", "robedSkeleton"];
w4 = ["clothedSkeleton", "robedSkeleton", "armoredSkeleton"];
w5 = ["clothedSkeleton", "clothedSkeleton", "armoredSkeleton"];
w6 = ["robedSkeleton", "armoredSkeleton"];
w7 = ["robedSkeleton", "armoredSkeleton"];
w8 = ["clothedSkeleton", "robedSkeleton", "armoredSkeleton"];
w9 = ["clothedSkeleton", "robedSkeleton", "armoredSkeleton"];
w10 = ["clothedSkeleton", "robedSkeleton", "armoredSkeleton"];
var enemies04 = [w1, w2, w3, w4, w5, w6, w7, w8, w9, w10];

// Set number of enemies in each wave, time between each wave (in seconds), and available spawn points for each level
var level = Array(4).fill({});
level[0].enemies = enemies01;
level[0].counts = [2, 2, 3, 3, 4, 4, 5, 5, 6, 8];
level[0].timeGaps = [3, 10, 12, 12, 15, 15, 18, 18, 21, 25];
level[1].enemies = enemies02;
level[1].counts = [2, 2, 3, 3, 4, 4, 5, 4, 5, 6];
level[1].timeGaps = [3, 10, 12, 12, 15, 15, 18, 18, 21, 25];
level[2].enemies = enemies03;
level[2].counts = [2, 2, 3, 3, 4, 4, 5, 5, 6, 8];
level[2].timeGaps = [3, 10, 12, 12, 15, 15, 18, 18, 21, 25];
level[3].enemies = enemies04;
level[3].counts = [2, 2, 3, 3, 4, 4, 5, 5, 6, 8];
level[3].timeGaps = [3, 10, 12, 12, 15, 15, 18, 18, 21, 25];

// Set a constant for this level composition data
var LEVEL_COMP = level;