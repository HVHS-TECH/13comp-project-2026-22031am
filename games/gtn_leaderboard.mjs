/*******************************************************/
// gtn_leaderboard.mjs
// GUESS THE NUMBER LEADERBOARD
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
        leaderboardBody.innerHTML = "";

        const leaderboardData = snapshot.val();

        if (!leaderboardData) {

            leaderboardBody.innerHTML = `
            <tr>
                <td colspan="4">
                No leaderboard data yet...
                </td>
                </tr>
            `;

            return;
        }

/*******************************************************/
// SORT BY WINS
/*******************************************************/
        const players=
        Object.entries(leaderboardData).sort((a,b)=>{
            return (b[1].wins || 0) - (a[1].wins || 0);
        });

/*******************************************************/
// DISPLAY TABLE
/*******************************************************/
        players.forEach(([playerName, player], index) => {

            const row = document.createElement("tr");

            let rank;
            if (index === 0) {
                rank = "🥇";
            }

            else if (index === 1) {
                rank = "🥈";
            }

            else if (index === 2) {
                rank = "🥉";
            }

            else {
                rank = index + 1;
            }
        
        row.innerHTML = `
        <td>${rank}</td>
        <td>${playerName}</td>
        <td>${player.wins || 0}</td>
        <td>${player.losses || 0}</td>
    `;

    
    leaderboardBody.appendChild(row);
        });
    });


        




    



