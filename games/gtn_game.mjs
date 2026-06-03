
/*******************************************************/
// gtn_game.mjs
// Guess the number page
// Main entry for GTN_game.html
// A simple 2-player game where you play guess the number with another buddy
// written by Aditi Modi term 1 & 2 2026
/*******************************************************/


/*******************************************************/
// IMPORTS
/*******************************************************/
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getDatabase,
    ref,
    set
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

/*******************************************************/
// FIREBASE CONFIG
/*******************************************************/
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

/*******************************************************/
// INITIALIZE FIREBASE
/*******************************************************/
const app = initializeApp(FB_GAMECONFIG);

const database = getDatabase(app);

/*******************************************************/
// variables()
/*******************************************************/
let secretNumber = Math.floor(Math.random() * 100) + 1;

console.log("Secret number is: " + secretNumber);

set(ref(database, "GTN/room1/secretNumber"), secretNumber);


/*******************************************************/
//  PLAYER NAMES
/*******************************************************/
document.getElementById("host-name").innerHTML = "Aditi";

document.getElementById("guest-name").innerHTML = "Buddy";


    
/*******************************************************/
// CHECK THE GUESS FUNCTION
/*******************************************************/
function checkGuess() {
    

    /*******************************************************/
    // GET THE HTML ELEMENTS

    /*******************************************************/

    const guessInput = document.getElementById("guess-input");

    const resultBox = document.getElementById("result-box");

    /*******************************************************/
    // GET THE PLAYER GUESS 
    /*******************************************************/
    let guess = Number(guessInput.value);
    console.log("Player guessed: " + guess);

    /*******************************************************/
    // CHECK THE PLAYER'S GUESS
    /*******************************************************/

    if (guess === secretNumber) {

        resultBox.innerHTML = "Correct! You guessed the number! Congratulations!";

        console.log("Correct! Player guessed the secret number!");

    } else if (guess < secretNumber) {

        resultBox.innerHTML = "Too low! Please try again";

        console.log("Too low! Please try again");

    } else {

        resultBox.innerHTML = "Too high! Please try again";
        console.log("Too high! Please try again");

    }
}





/*******************************************************/
window.checkGuess = checkGuess; // Making the function accessible globally so it can be called from the HTML button
/*******************************************************/

