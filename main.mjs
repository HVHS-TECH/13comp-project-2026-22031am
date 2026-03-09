/**************************************************************/
// main.mjs
// Main entry for index.html
// Written by Aditi Modi , Term 1 2026?
/**************************************************************/

const COL_C = 'white';	   	
const COL_B = '#CD7F32';	
console.log('%c main.mjs', 
    'color: blue; background-color: white;');

/**************************************************************/
// Import all external constants & functions required
/**************************************************************/
// Import all the constants & functions required from fb_io module

import { fb_initialise, fb_authenticate, fb_detectLogin, fb_logout, fb_writerecord } from './fb/fb_io.mjs';

fb_initialise();

window.fb_authenticate = fb_authenticate;
window.fb_detectLogin  = fb_detectLogin;
window.fb_logout = fb_logout;
window.fb_writerecord = fb_writerecord;

/**************************************************************/
//   END OF CODE
/**************************************************************/