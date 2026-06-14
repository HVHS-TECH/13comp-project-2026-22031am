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
// FIREBASE CONFIG
/******************************************************/

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

/******************************************************/
// INITIALISE FIREBASE
/******************************************************/

const app = initializeApp(FB_GAMECONFIG);

const database = getDatabase(app);

/******************************************************/
// HTML ELEMENT
/******************************************************/
    const leaderboardBody = 
        document.getElementById("leaderboard-body");

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








