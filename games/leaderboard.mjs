
/*******************************************************/
// leaderboard.mjs
// leaderboard page
// Main entry for GTN_game.html
// A simple 2-player game where you play guess the number with another buddy
// written by Aditi Modi term 1 & 2 2026
/*******************************************************/

/**************************************************************/
// Import all the constants & functions required from the fb_io module

import { fb_initialise, fb_sortedread } from './fb_io.mjs';
fb_initialise();
/**************************************************************/

/**************************************************************/
// Leaderboard code goes here
// 
/*******************************************************/
fb_sortedread();

document.getElementById('backHomeBtn').onclick = () => {
  window.location.href = 'fc_home.html';
};

/*******************************************************/
// END OF APP
/*******************************************************/

