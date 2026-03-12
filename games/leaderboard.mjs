/**************************************************************/
// leaderboard.mjs
// Main entry for leaderboard.html
// Written by Aditi Modi, Term 1 2026
/**************************************************************/

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