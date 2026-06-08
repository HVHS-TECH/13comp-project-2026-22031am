/*******************************************************/
// gtn_leaderboard.mjs
/*******************************************************/

import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getDatabase,
    ref,
    onValue
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";


/******************************************************/
// fb_initialise()
/******************************************************/
function fb_initialise() {
    console.log('%c fb_initialise(): ',
                 'color: ' + COL_C + '; background-color: ' + COL_B + ';');
                 
    const FB_GAMECONFIG = {
      apiKey: "AIzaSyDWhGSciprdeHTyBrXQYt_F-6tMMjCg-YM",
      authDomain: "comp-2026-aditi-modi.firebaseapp.com",
      databaseURL: "https://comp-2026-aditi-modi-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "comp-2026-aditi-modi",
      storageBucket: "comp-2026-aditi-modi.firebasestorage.app",
      messagingSenderId: "153559444524",
      appId: "1:153559444524:web:7144aeb2795255e4e1b589",
      measurementId: "G-0KELMX0418"
    };

    const FB_GAMEAPP = initializeApp(FB_GAMECONFIG);
    FB_GAMEDB = getDatabase(FB_GAMEAPP);
    FB_GAMEAUTH = getAuth(FB_GAMEAPP);
    
    console.info(FB_GAMEDB);      	//DIAG
}

/*******************************************************/
// HTML ELEMENT
/*******************************************************/

const leaderboardBody = document.getElementById("leaderboard-body");

/*******************************************************/
// FIREBASE REFERENCE
/*******************************************************/

const leaderboardRef = ref(database, "GTN/Leaderboard");

/*******************************************************/
// READ LEADERBOARD
/*******************************************************/
    onValue(leaderboardRef, (snapshot) => {
        const leaderboardData = snapshot.val();

        leaderboardBody.innerHTML = "";
        if (!leaderboardData) {

            leaderboardBody.innerHTML = `
            <tr>
                <td colspan="3">
                No leaderboard data yet...
                </td>
                </tr>
            `;

            return;
        }

/*******************************************************/
// LOOP THROUGH PLAYERS
/*******************************************************/

Object.keys(leaderboardData).forEach((playerName) => {

    const player = leaderboardData[playerName];

    const row = document.createElement("tr");

    row.innerHTML = `
            <td>${playerName}</td>

            <td>${player.wins || 0}</td>

            <td>${player.losses || 0}</td>
        `;

        leaderboardBody.appendChild(row);
    });
});






