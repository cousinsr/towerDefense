// Tiled properties:
var TILE_WIDTH = 64;
var TILE_HEIGHT = 64;
var TILE_COUNT_WIDTH = 25;
var TILE_COUNT_HEIGHT = 20;
var TILE_LEVELS = ["level01", "level02", "level03"];

// Tower menu ids
var TOWER_MENU_RANGE = 1;
var TOWER_MENU_STUN = 2;
var TOWER_MENU_EXPLODE = 3;
var TOWER_MENU_SELL = 4;

// Tower costs
var TOWER_COST_RANGE = 50;
var TOWER_COST_STUN = 50;
var TOWER_COST_EXPLODE = 75;
var TOWER_SELL_RATE = 0.5;

// Enemy's death gold reward:
var ENEMY_GOLD_CLOTHED = 5;
var ENEMY_GOLD_ROBED = 10;
var ENEMY_GOLD_ARMORED = 15;

// Gold values
var START_GOLD = 100;
var GOLD_LEVEL_REWARD = 50;

// Life values:
var START_LIFE = 10;

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
w8 = ["clothedSkeleton", "robedSkeleton", "armoredSkeleton"];
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

// Set number of enemies in each wave, time between each wave (in seconds), and available spawn points for each level
var level = Array(3).fill({});
level[0].enemies = enemies01;
level[0].counts = [2, 2, 3, 3, 4, 4, 5, 5, 6, 8];
level[0].timeGaps = [3, 10, 12, 12, 15, 15, 18, 18, 21, 25];
level[1].enemies = enemies02;
level[1].counts = [2, 2, 3, 3, 4, 4, 5, 5, 6, 8];
level[1].timeGaps = [3, 10, 12, 12, 15, 15, 18, 18, 21, 25];
level[2].enemies = enemies03;
level[2].counts = [2, 2, 3, 3, 4, 4, 5, 5, 6, 8];
level[2].timeGaps = [3, 10, 12, 12, 15, 15, 18, 18, 21, 25];

// Set a constant for this level composition data
var LEVEL_COMP = level;